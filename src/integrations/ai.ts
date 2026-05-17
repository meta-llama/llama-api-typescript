/**
 * Integration with Vercel's [`ai`](https://www.npmjs.com/package/ai) package.
 * Requires peer dependencies `ai` and `@ai-sdk/provider`.
 */
import type {
  JSONSchema7,
  LanguageModelV3,
  LanguageModelV3CallOptions,
  LanguageModelV3FilePart,
  LanguageModelV3FunctionTool,
  LanguageModelV3GenerateResult,
  LanguageModelV3Prompt,
  LanguageModelV3ProviderTool,
  LanguageModelV3StreamPart,
  LanguageModelV3StreamResult,
  LanguageModelV3ToolCall,
  LanguageModelV3ToolCallPart,
  LanguageModelV3ToolChoice,
  LanguageModelV3ToolResultOutput,
  SharedV3Warning,
} from '@ai-sdk/provider';

import { LlamaAPIClient, type ClientOptions } from '../client';
import type { ReadableStream as WebReadableStream } from 'stream/web';

import type {
  CompletionMessage,
  Message,
  MessageImageContentItem,
  MessageTextContentItem,
  UserMessage,
  CreateChatCompletionResponseStreamChunk,
} from '../resources/chat/chat';

import type { CompletionCreateParams } from '../resources/chat/completions';
import type { RequestOptions } from '../internal/request-options';
import { makeReadableStream } from '../internal/shims';

/** Same options accepted by {@link LlamaAPIClient}. */
export type LlamaAIProviderOptions = ClientOptions | undefined;

const PROVIDER_ID = 'llama-api';

/** Llama Inference model handle consumed by helpers such as `generateText` from `ai`. */
export type LlamaModelFactory = (modelId: string) => LanguageModelV3;

/**
 * Create a Llama Inference API-backed language model factory for use with `ai`.
 *
 * @example
 * ```ts
 * import { generateText } from 'ai';
 * import { createLlama } from 'llama-api-client/ai';
 *
 * const llama = createLlama();
 * await generateText({
 *   model: llama('Llama-4-Maverick-17B-128E-Instruct-FP8'),
 *   prompt: 'Hello!',
 * });
 * ```
 */
export function createLlama(options?: LlamaAIProviderOptions): LlamaModelFactory {
  const client = new LlamaAPIClient(options);
  return (modelId: string): LanguageModelV3 => ({
    specificationVersion: 'v3',
    provider: PROVIDER_ID,
    modelId,
    supportedUrls: {},
    doGenerate(call) {
      return doLlamaGenerate(client, modelId, call);
    },
    doStream(call) {
      return doLlamaStream(client, modelId, call);
    },
  });
}

export function llamaPromptToMessages(
  prompt: LanguageModelV3Prompt,
  warningsOut: SharedV3Warning[],
): Message[] {
  const messages: Message[] = [];

  for (const m of prompt) {
    if ((m as { role?: string }).role === 'system') {
      const sys = m as Extract<LanguageModelV3Prompt[number], { role: 'system' }>;
      messages.push({ role: 'system', content: sys.content });
      continue;
    }

    if ((m as { role?: string }).role === 'user') {
      messages.push(
        convertUserMessage(m as Extract<LanguageModelV3Prompt[number], { role: 'user' }>, warningsOut),
      );
      continue;
    }

    if ((m as { role?: string }).role === 'assistant') {
      messages.push(
        convertAssistantMessage(
          m as Extract<LanguageModelV3Prompt[number], { role: 'assistant' }>,
          warningsOut,
        ),
      );
      continue;
    }

    if ((m as { role?: string }).role === 'tool') {
      const toolMsgs = m as Extract<LanguageModelV3Prompt[number], { role: 'tool' }>;
      for (const part of toolMsgs.content) {
        if ((part as { type?: string }).type === 'tool-result') {
          const tr = part as Extract<(typeof toolMsgs.content)[number], { type: 'tool-result' }>;
          messages.push({
            role: 'tool',
            tool_call_id: tr.toolCallId,
            content: toolOutputToAssistantFacingText(tr.output),
          });
          continue;
        }
        warningsOut.push({
          type: 'unsupported',
          feature: `tool prompt part '${(part as { type?: string }).type ?? 'unknown'}'`,
        });
      }
      continue;
    }

    warningsOut.push({
      type: 'unsupported',
      feature: `message role '${(m as { role?: string }).role ?? 'unknown'}'`,
    });
  }

  return messages;
}

function convertUserMessage(
  um: Extract<LanguageModelV3Prompt[number], { role: 'user' }>,
  warningsOut: SharedV3Warning[],
): UserMessage {
  const parts = um.content;
  if (parts.length === 1 && parts[0] !== undefined) {
    const only = parts[0];
    if (only.type === 'text') return { role: 'user', content: only.text };
  }

  const out: Array<MessageTextContentItem | MessageImageContentItem> = [];

  for (const p of parts) {
    if (p.type === 'text') {
      out.push({ type: 'text', text: p.text });
      continue;
    }
    if (p.type === 'file') {
      const img = filePartToImageItem(p);
      if (img) {
        out.push(img);
      } else {
        warningsOut.push({
          type: 'unsupported',
          feature: `file mediaType '${p.mediaType}'`,
          details: 'Only image/* uploads are forwarded to Llama as image_url content.',
        });
      }
      continue;
    }
    warningsOut.push({
      type: 'unsupported',
      feature: `user prompt part '${(p as { type?: string }).type ?? 'unknown'}'`,
    });
  }

  return { role: 'user', content: out };
}

function convertAssistantMessage(
  msg: Extract<LanguageModelV3Prompt[number], { role: 'assistant' }>,
  warningsOut: SharedV3Warning[],
): Message {
  let textPieces: string[] = [];
  const tool_calls: CompletionMessage.ToolCall[] = [];

  for (const p of msg.content) {
    if (p.type === 'text') {
      textPieces.push(p.text);
      continue;
    }
    if (p.type === 'tool-call') {
      const tcp = p as LanguageModelV3ToolCallPart;
      const args =
        typeof tcp.input === 'string' ?
          tcp.input
        : (() => {
            try {
              return JSON.stringify(tcp.input as unknown);
            } catch {
              return '{}';
            }
          })();
      tool_calls.push({
        id: tcp.toolCallId,
        function: {
          name: tcp.toolName,
          arguments: args,
        },
      });
      continue;
    }
    if (p.type === 'reasoning') {
      warningsOut.push({
        type: 'unsupported',
        feature: 'assistant reasoning replay',
        details: 'Reasoning fragments are stripped when replaying assistant history.',
      });
      continue;
    }
    warningsOut.push({
      type: 'unsupported',
      feature: `assistant content part '${(p as { type?: string }).type ?? 'unknown'}'`,
      details: 'Part omitted when mapping to Llama chat messages.',
    });
  }

  const body: CompletionMessage = { role: 'assistant', stop_reason: 'stop' };
  const concat = textPieces.join('');
  if (concat.length > 0) body.content = concat;
  if (tool_calls.length > 0) body.tool_calls = tool_calls;

  return body;
}

function filePartToImageItem(part: LanguageModelV3FilePart): MessageImageContentItem | undefined {
  if (!/^image\//.test(part.mediaType)) return undefined;

  const data = part.data;
  if (typeof data === 'string') {
    const url =
      /^https?:\/\//i.test(data) || /^data:image\//.test(data) ?
        data
      : `data:${part.mediaType};base64,${data}`;
    return {
      type: 'image_url',
      image_url: { url },
    };
  }

  if (data instanceof Uint8Array) {
    const b64 =
      typeof Buffer !== 'undefined' ?
        Buffer.from(data).toString('base64')
      : btoa(Array.from(data, (c) => String.fromCharCode(c)).join(''));
    return {
      type: 'image_url',
      image_url: { url: `data:${part.mediaType};base64,${b64}` },
    };
  }

  if (data instanceof URL) {
    return { type: 'image_url', image_url: { url: String(data.href) } };
  }

  return undefined;
}

function toolOutputToAssistantFacingText(out: LanguageModelV3ToolResultOutput): string {
  switch (out.type) {
    case 'json':
      return JSON.stringify(out.value);
    case 'text':
    case 'error-text':
      return out.value;
    case 'content':
      return JSON.stringify(out.value);
    case 'error-json':
      return JSON.stringify(out.value);
    case 'execution-denied':
      return JSON.stringify({
        denied: true,
        ...(typeof out.reason === 'string' ? { reason: out.reason } : {}),
      });
    default:
      try {
        return JSON.stringify(out);
      } catch {
        return '[unserializable tool output]';
      }
  }
}

function buildStaticWarnings(call: LanguageModelV3CallOptions): SharedV3Warning[] {
  const warnings: SharedV3Warning[] = [];
  const tools = call.tools;

  if (tools) {
    for (const tool of tools) {
      const t = tool as LanguageModelV3FunctionTool | LanguageModelV3ProviderTool;
      if (t.type !== 'function') {
        warnings.push({
          type: 'unsupported',
          feature: `tool type '${(t as { type: string }).type}'`,
          details: 'Only function tools are passed through to Llama Inference API.',
        });
      }
    }
  }

  if (call.seed !== undefined) {
    warnings.push({
      type: 'unsupported',
      feature: 'seed',
      details: 'Not mapped onto Llama parameters in this integration.',
    });
  }

  if (call.stopSequences !== undefined && call.stopSequences.length > 0) {
    warnings.push({
      type: 'unsupported',
      feature: 'stopSequences',
      details: 'Not exposed by the Llama API TypeScript SDK yet.',
    });
  }

  if (call.presencePenalty !== undefined || call.frequencyPenalty !== undefined) {
    warnings.push({
      type: 'unsupported',
      feature: 'presencePenalty / frequencyPenalty',
      details:
        'Not mapped (use Llama Inference `repetition_penalty` via `LlamaAPIClient` directly if you need parity).',
    });
  }

  return warnings;
}

function mapToolChoice(
  choice?: LanguageModelV3ToolChoice,
): CompletionCreateParams['tool_choice'] | undefined {
  if (!choice) return undefined;
  switch (choice.type) {
    case 'none':
      return 'none';
    case 'auto':
      return 'auto';
    case 'required':
      return 'required';
    case 'tool':
      return {
        type: 'function',
        function: { name: choice.toolName },
      } satisfies CompletionCreateParams.ChatCompletionNamedToolChoice;
    default: {
      const _never: never = choice;
      return _never;
    }
  }
}

function mapTools(tools?: LanguageModelV3FunctionTool[]): CompletionCreateParams['tools'] | undefined {
  const onlyFn = tools?.filter(
    (t): t is LanguageModelV3FunctionTool => (t as { type?: string }).type === 'function',
  );
  if (!onlyFn?.length) return undefined;
  return onlyFn.map(
    (t): CompletionCreateParams.Tool => ({
      type: 'function',
      function: {
        name: t.name,
        ...(t.description !== undefined ? { description: t.description } : {}),
        parameters: structuredCloneLoose(t.inputSchema) as { [key: string]: unknown },
        ...(t.strict !== undefined ? { strict: t.strict } : {}),
      },
    }),
  );
}

function structuredCloneLoose<T>(v: T): T {
  if (typeof structuredClone !== 'undefined') return structuredClone(v);
  return JSON.parse(JSON.stringify(v)) as T;
}

function jsonSchemaLite(schema: JSONSchema7): unknown {
  return structuredCloneLoose(schema) as unknown;
}

function responseFormatFromCall(
  call: LanguageModelV3CallOptions,
  warnings: SharedV3Warning[],
): CompletionCreateParams['response_format'] | undefined {
  const rf = call.responseFormat;
  if (!rf) return undefined;
  if (rf.type === 'text') return { type: 'text' };

  const name = rf.name ?? 'response';
  if (rf.schema === undefined || rf.schema === null) {
    warnings.push({
      type: 'unsupported',
      feature: 'structured json without explicit schema',
      details:
        'Falling back to a permissive object schema (`additionalProperties: true`) via Llama-native `json_schema`.',
    });
    const permissiveObject: JSONSchema7 = { type: 'object', additionalProperties: true };
    return {
      type: 'json_schema',
      json_schema: {
        name,
        ...(rf.description !== undefined ? { description: rf.description } : {}),
        schema: jsonSchemaLite(permissiveObject),
      },
    };
  }

  return {
    type: 'json_schema',
    json_schema: {
      name,
      ...(rf.description !== undefined ? { description: rf.description } : {}),
      schema: jsonSchemaLite(rf.schema),
    },
  };
}

/** Assembles non-stream completion body and appends calibration warnings shared by generate + stream. */
function assembleBody(
  modelId: string,
  messages: Message[],
  call: LanguageModelV3CallOptions,
  warningsAcc: SharedV3Warning[],
): Omit<CompletionCreateParams, 'stream'> {
  warningsAcc.push(...buildStaticWarnings(call));

  const body: Omit<CompletionCreateParams, 'stream'> = {
    model: modelId,
    messages,
  };

  const maxTok = call.maxOutputTokens;
  const temp = call.temperature;
  const top_p = call.topP;
  const top_k = call.topK;
  const tool_choice = mapToolChoice(call.toolChoice);
  const tools = mapTools(
    call.tools?.filter((t) => (t as { type?: string }).type === 'function') as LanguageModelV3FunctionTool[],
  );
  const response_format = responseFormatFromCall(call, warningsAcc);

  if (maxTok !== undefined) body.max_completion_tokens = maxTok;
  if (temp !== undefined) body.temperature = temp;
  if (top_p !== undefined) body.top_p = top_p;
  if (top_k !== undefined) body.top_k = top_k;
  if (tools !== undefined) body.tools = tools;
  if (tool_choice !== undefined) body.tool_choice = tool_choice;
  if (response_format !== undefined) body.response_format = response_format;

  return body;
}

function llamaReqOptions(call: LanguageModelV3CallOptions): RequestOptions {
  const ro: RequestOptions = {};
  const signal = call.abortSignal;
  if (signal !== undefined && signal !== null) ro.signal = signal;
  const headers = call.headers;
  if (headers !== undefined) {
    const out: Record<string, string> = {};
    for (const [key, val] of Object.entries(headers)) {
      if (val !== undefined) out[key] = val;
    }
    if (Object.keys(out).length > 0) ro.headers = out;
  }
  return ro;
}

function emptyUsage(): LanguageModelV3GenerateResult['usage'] {
  return {
    inputTokens: { total: undefined, cacheRead: undefined, cacheWrite: undefined, noCache: undefined },
    outputTokens: { total: undefined, text: undefined, reasoning: undefined },
  };
}

function normalizeFinish(
  sr: CompletionMessage['stop_reason'],
): LanguageModelV3GenerateResult['finishReason'] {
  const raw =
    sr === 'tool_calls' ? 'tool_calls'
    : sr === 'length' ? 'length'
    : sr === 'stop' ? 'stop'
    : undefined;

  const unified =
    sr === 'tool_calls' ? 'tool-calls'
    : sr === 'length' ? 'length'
    : sr === 'stop' ? 'stop'
    : 'other';

  return { unified, raw };
}

function extractAssistantText(cm: CompletionMessage): string | undefined {
  const c = cm.content;
  if (c === undefined || c === null) return undefined;
  if (typeof c === 'string') return c;
  if (typeof c === 'object' && 'type' in c && c.type === 'text') return (c as MessageTextContentItem).text;
  return undefined;
}

async function doLlamaGenerate(
  client: LlamaAPIClient,
  modelId: string,
  call: LanguageModelV3CallOptions,
): Promise<LanguageModelV3GenerateResult> {
  const warnings: SharedV3Warning[] = [];
  const messages = llamaPromptToMessages(call.prompt, warnings);
  const bodyBase = assembleBody(modelId, messages, call, warnings);

  const body = { ...bodyBase, stream: false as const };
  const reply = await client.chat.completions.create(body, llamaReqOptions(call));

  const warningsOut = warnings;

  const content: LanguageModelV3GenerateResult['content'] = [];
  const txt = extractAssistantText(reply.completion_message);

  if (txt !== undefined && txt.length > 0) content.push({ type: 'text', text: txt });
  const tCalls = reply.completion_message.tool_calls;
  if (tCalls?.length) {
    for (const tc of tCalls) {
      const part: LanguageModelV3ToolCall = {
        type: 'tool-call',
        toolCallId: tc.id,
        toolName: tc.function.name,
        input: tc.function.arguments,
      };
      content.push(part);
    }
  }

  return {
    content,
    finishReason: normalizeFinish(reply.completion_message.stop_reason),
    usage: emptyUsage(),
    warnings: warningsOut,
    response: reply.id !== undefined ? { id: reply.id } : {},
  };
}

type ToolAccumulator = {
  id?: string;
  name?: string;
  arguments: string;
};

function applyToolDelta(
  aggregates: ToolAccumulator[],
  delta: CreateChatCompletionResponseStreamChunk.Event.ToolCallDelta,
): void {
  const id = delta.id;
  const last = aggregates[aggregates.length - 1];
  const mergeIntoLast = last !== undefined && (last.id === id || (last.id === undefined && id === undefined));

  let target: ToolAccumulator;

  if (mergeIntoLast) {
    target = last;
    if (id !== undefined && target.id === undefined) target.id = id;
  } else {
    target = {
      ...(id !== undefined ? { id } : {}),
      arguments: '',
    };
    aggregates.push(target);
  }

  const fnName = delta.function?.name;
  if (fnName !== undefined && fnName.length > 0) {
    target.name = (target.name ?? '') + fnName;
  }

  const fnArgs = delta.function?.arguments;
  if (fnArgs !== undefined && fnArgs.length > 0) {
    target.arguments += fnArgs;
  }
}

function randomBlockId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function mergeMetricsIntoUsage(
  usage: LanguageModelV3GenerateResult['usage'],
  metrics?: ReadonlyArray<CreateChatCompletionResponseStreamChunk.Event.Metric>,
): LanguageModelV3GenerateResult['usage'] {
  if (!metrics?.length) return usage;
  let input: number | undefined;
  let output: number | undefined;
  for (const row of metrics) {
    const name = row.metric?.toLowerCase() ?? '';
    const v = row.value;
    if (/prompt/.test(name) && /token/.test(name)) {
      input = v;
      continue;
    }
    if ((/completion/.test(name) || /generation/.test(name)) && /token/.test(name)) {
      output = v;
      continue;
    }
  }
  return {
    inputTokens: {
      total: input ?? usage.inputTokens.total,
      noCache: usage.inputTokens.noCache,
      cacheRead: usage.inputTokens.cacheRead,
      cacheWrite: usage.inputTokens.cacheWrite,
    },
    outputTokens: {
      total: output ?? usage.outputTokens.total,
      text: usage.outputTokens.text,
      reasoning: usage.outputTokens.reasoning,
    },
  };
}

async function doLlamaStream(
  client: LlamaAPIClient,
  modelId: string,
  call: LanguageModelV3CallOptions,
): Promise<LanguageModelV3StreamResult> {
  const warnings: SharedV3Warning[] = [];
  const messages = llamaPromptToMessages(call.prompt, warnings);
  const base = assembleBody(modelId, messages, call, warnings);
  const body = { ...base, stream: true as const };

  const sse = await client.chat.completions.create(body, llamaReqOptions(call));

  let usageAccumulator = emptyUsage();

  const rawStream = makeReadableStream({
    async start(controller) {
      const streamWarnings: SharedV3Warning[] = [...warnings];
      controller.enqueue({ type: 'stream-start', warnings: streamWarnings });
      const blockId = randomBlockId('text');
      controller.enqueue({ type: 'text-start', id: blockId });

      const toolAggregates: ToolAccumulator[] = [];
      let finish = normalizeFinish(undefined);

      try {
        for await (const chunk of sse) {
          const ev = chunk.event;
          const sr = ev.stop_reason;
          if (sr !== undefined) finish = normalizeFinish(sr);

          usageAccumulator = mergeMetricsIntoUsage(usageAccumulator, ev.metrics);

          if (ev.event_type === 'progress') {
            const d = ev.delta;

            if (d.type === 'text') {
              const t = d.text ?? '';

              const deltaText = typeof t === 'string' ? t : '';
              if (deltaText.length > 0) {
                controller.enqueue({ type: 'text-delta', id: blockId, delta: deltaText });
              }
              continue;
            }

            if (d.type === 'tool_call') {
              applyToolDelta(toolAggregates, d);
              continue;
            }
          }
        }

        controller.enqueue({ type: 'text-end', id: blockId });

        for (let i = 0; i < toolAggregates.length; i++) {
          const agg = toolAggregates[i]!;
          const part: LanguageModelV3ToolCall = {
            type: 'tool-call',
            toolCallId: agg.id ?? `tool_call_${i}`,
            toolName: agg.name ?? '',
            input: agg.arguments.trim().length > 0 ? agg.arguments : '{}',
          };
          controller.enqueue(part);
        }

        controller.enqueue({
          type: 'finish',
          usage: usageAccumulator,
          finishReason: finish,
        });
        controller.close();
      } catch (error) {
        controller.enqueue({ type: 'error', error });
        try {
          controller.close();
        } catch {
          // ignored
        }
      }
    },
    cancel: () => {
      sse.controller.abort();
    },
  });

  const stream = rawStream as unknown as WebReadableStream<LanguageModelV3StreamPart>;

  return { stream, request: { body } };
}
