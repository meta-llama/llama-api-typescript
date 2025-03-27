// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as InferenceAPI from './inference';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { Stream } from '../core/streaming';
import { RequestOptions } from '../internal/request-options';

export class Inference extends APIResource {
  /**
   * Generate a chat completion for the given messages using the specified model.
   */
  chatCompletion(
    body: InferenceChatCompletionParamsNonStreaming,
    options?: RequestOptions,
  ): APIPromise<ChatCompletionResponse>;
  chatCompletion(
    body: InferenceChatCompletionParamsStreaming,
    options?: RequestOptions,
  ): APIPromise<Stream<ChatCompletionResponseStreamChunk>>;
  chatCompletion(
    body: InferenceChatCompletionParamsBase,
    options?: RequestOptions,
  ): APIPromise<Stream<ChatCompletionResponseStreamChunk> | ChatCompletionResponse>;
  chatCompletion(
    body: InferenceChatCompletionParams,
    options?: RequestOptions,
  ): APIPromise<ChatCompletionResponse> | APIPromise<Stream<ChatCompletionResponseStreamChunk>> {
    return this._client.post('/v1/inference/chat-completion', {
      body,
      ...options,
      stream: body.stream ?? false,
    }) as APIPromise<ChatCompletionResponse> | APIPromise<Stream<ChatCompletionResponseStreamChunk>>;
  }
}

export interface ChatCompletionRequest {
  /**
   * List of messages in the conversation
   */
  messages: Array<Shared.Message>;

  /**
   * The identifier of the model to use.
   */
  model_id: string;

  /**
   * If specified, log probabilities for each token position will be returned.
   */
  logprobs?: ChatCompletionRequest.Logprobs;

  max_completion_tokens?: number;

  repetition_penalty?: number;

  /**
   * Grammar specification for guided (structured) decoding. There are two options: -
   * `ResponseFormat.json_schema`: The grammar is a JSON schema. Most providers
   * support this format. - `ResponseFormat.grammar`: The grammar is a BNF grammar.
   * This format is more flexible, but not all providers support it.
   */
  response_format?:
    | ChatCompletionRequest.JsonSchemaResponseFormat
    | ChatCompletionRequest.GrammarResponseFormat;

  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream?: boolean;

  temperature?: number;

  /**
   * Whether tool use is required or automatic. Defaults to ToolChoice.auto. ..
   * deprecated:: Use tool_config instead.
   */
  tool_choice?: 'auto' | 'required' | 'none';

  /**
   * Configuration for tool use.
   */
  tool_config?: ChatCompletionRequest.ToolConfig;

  /**
   * Instructs the model how to format tool calls. By default, Llama Stack will
   * attempt to use a format that is best adapted to the model. -
   * `ToolPromptFormat.json`: The tool calls are formatted as a JSON object. -
   * `ToolPromptFormat.function_tag`: The tool calls are enclosed in a
   * <function=function_name> tag. - `ToolPromptFormat.python_list`: The tool calls
   * are output as Python syntax -- a list of function calls. .. deprecated:: Use
   * tool_config instead.
   */
  tool_prompt_format?: 'json' | 'function_tag' | 'python_list';

  /**
   * List of tool definitions available to the model
   */
  tools?: Array<ChatCompletionRequest.Tool>;

  top_k?: number;

  top_p?: number;
}

export namespace ChatCompletionRequest {
  /**
   * If specified, log probabilities for each token position will be returned.
   */
  export interface Logprobs {
    /**
     * How many tokens (for each position) to return log probabilities for.
     */
    top_k?: number;
  }

  /**
   * Configuration for JSON schema-guided response generation.
   */
  export interface JsonSchemaResponseFormat {
    /**
     * The JSON schema the response should conform to. In a Python SDK, this is often a
     * `pydantic` model.
     */
    json_schema: unknown;

    /**
     * Must be "json_schema" to identify this format type
     */
    type: 'json_schema';
  }

  /**
   * Configuration for grammar-guided response generation.
   */
  export interface GrammarResponseFormat {
    /**
     * The BNF grammar specification the response should conform to
     */
    bnf: Record<string, boolean | number | string | Array<unknown> | unknown | null>;

    /**
     * Must be "grammar" to identify this format type
     */
    type: 'grammar';
  }

  /**
   * Configuration for tool use.
   */
  export interface ToolConfig {
    /**
     * Config for how to override the default system prompt. -
     * `SystemMessageBehavior.append`: Appends the provided system message to the
     * default system prompt. - `SystemMessageBehavior.replace`: Replaces the default
     * system prompt with the provided system message. The system message can include
     * the string '{{function_definitions}}' to indicate where the function definitions
     * should be inserted.
     */
    system_message_behavior?: 'append' | 'replace';

    /**
     * Whether tool use is automatic, required, or none. Can also specify a tool name
     * to use a specific tool. Defaults to ToolChoice.auto.
     */
    tool_choice?: 'auto' | 'required' | 'none' | (string & {});

    /**
     * Instructs the model how to format tool calls. By default, Llama Stack will
     * attempt to use a format that is best adapted to the model. -
     * `ToolPromptFormat.json`: The tool calls are formatted as a JSON object. -
     * `ToolPromptFormat.function_tag`: The tool calls are enclosed in a
     * <function=function_name> tag. - `ToolPromptFormat.python_list`: The tool calls
     * are output as Python syntax -- a list of function calls.
     */
    tool_prompt_format?: 'json' | 'function_tag' | 'python_list';
  }

  export interface Tool {
    tool_name: 'brave_search' | 'wolfram_alpha' | 'photogen' | 'code_interpreter' | (string & {});

    description?: string;

    parameters?: Record<string, Tool.Parameters>;
  }

  export namespace Tool {
    export interface Parameters {
      param_type: string;

      default?: boolean | number | string | Array<unknown> | unknown | null;

      description?: string;

      required?: boolean;
    }
  }
}

/**
 * Response from a chat completion request.
 */
export interface ChatCompletionResponse {
  /**
   * The complete response message
   */
  completion_message: Shared.CompletionMessage;

  /**
   * Optional log probabilities for generated tokens
   */
  logprobs?: Array<ChatCompletionResponse.Logprob>;

  metrics?: Array<ChatCompletionResponse.Metric>;
}

export namespace ChatCompletionResponse {
  /**
   * Log probabilities for generated tokens.
   */
  export interface Logprob {
    /**
     * Dictionary mapping tokens to their log probabilities
     */
    logprobs_by_token: Record<string, number>;
  }

  export interface Metric {
    metric: string;

    value: number;

    unit?: string;
  }
}

/**
 * An event during chat completion generation.
 */
export interface ChatCompletionResponseEvent {
  /**
   * Content generated since last event. This can be one or more tokens, or a tool
   * call.
   */
  delta: ContentDelta;

  /**
   * Type of the event
   */
  event_type: 'start' | 'complete' | 'progress';

  /**
   * Optional log probabilities for generated tokens
   */
  logprobs?: Array<ChatCompletionResponseEvent.Logprob>;

  /**
   * Optional reason why generation stopped, if complete
   */
  stop_reason?: 'end_of_turn' | 'end_of_message' | 'out_of_tokens';
}

export namespace ChatCompletionResponseEvent {
  /**
   * Log probabilities for generated tokens.
   */
  export interface Logprob {
    /**
     * Dictionary mapping tokens to their log probabilities
     */
    logprobs_by_token: Record<string, number>;
  }
}

/**
 * A chunk of a streamed chat completion response.
 */
export interface ChatCompletionResponseStreamChunk {
  /**
   * The event containing the new content
   */
  event: ChatCompletionResponseEvent;

  metrics?: Array<ChatCompletionResponseStreamChunk.Metric>;
}

export namespace ChatCompletionResponseStreamChunk {
  export interface Metric {
    metric: string;

    value: number;

    unit?: string;
  }
}

export type ContentDelta =
  | ContentDelta.TextDelta
  | ContentDelta.ImageDelta
  | ContentDelta.ToolCallDelta
  | ContentDelta.ReasoningContentDelta;

export namespace ContentDelta {
  export interface TextDelta {
    text: string;

    type: 'text';
  }

  export interface ImageDelta {
    image: string;

    type: 'image';
  }

  export interface ToolCallDelta {
    parse_status: 'started' | 'in_progress' | 'failed' | 'succeeded';

    tool_call: string | ToolCallDelta.ToolCall;

    type: 'tool_call';
  }

  export namespace ToolCallDelta {
    export interface ToolCall {
      arguments:
        | string
        | Record<
            string,
            | string
            | number
            | boolean
            | Array<string | number | boolean | null>
            | Record<string, string | number | boolean | null>
            | null
          >;

      call_id: string;

      tool_name: 'brave_search' | 'wolfram_alpha' | 'photogen' | 'code_interpreter' | (string & {});

      arguments_json?: string;
    }
  }

  export interface ReasoningContentDelta {
    answer: string;

    reasoning: string;

    type: 'reasoning';
  }
}

/**
 * A image content item
 */
export interface ImageContentItem {
  /**
   * Image as a base64 encoded string or an URL
   */
  image: ImageContentItem.Image;

  /**
   * Discriminator type of the content item. Always "image"
   */
  type: 'image';
}

export namespace ImageContentItem {
  /**
   * Image as a base64 encoded string or an URL
   */
  export interface Image {
    /**
     * base64 encoded image data as string
     */
    data?: string;

    /**
     * A URL of the image or data URL in the format of data:image/{type};base64,{data}.
     * Note that URL could have length limits.
     */
    url?: Image.URL;
  }

  export namespace Image {
    /**
     * A URL of the image or data URL in the format of data:image/{type};base64,{data}.
     * Note that URL could have length limits.
     */
    export interface URL {
      uri: string;
    }
  }
}

/**
 * A reasoning content item
 */
export interface ReasoningContentItem {
  /**
   * The final model response
   */
  answer: string;

  /**
   * The CoT reasoning content of the model
   */
  reasoning: string;

  /**
   * Discriminator type of the content item. Always "reasoning"
   */
  type: 'reasoning';
}

/**
 * A text content item
 */
export interface TextContentItem {
  /**
   * Text content
   */
  text: string;

  /**
   * Discriminator type of the content item. Always "text"
   */
  type: 'text';
}

export type InferenceChatCompletionParams =
  | InferenceChatCompletionParamsNonStreaming
  | InferenceChatCompletionParamsStreaming;

export interface InferenceChatCompletionParamsBase {
  /**
   * List of messages in the conversation
   */
  messages: Array<Shared.Message>;

  /**
   * The identifier of the model to use.
   */
  model_id: string;

  /**
   * If specified, log probabilities for each token position will be returned.
   */
  logprobs?: InferenceChatCompletionParams.Logprobs;

  max_completion_tokens?: number;

  repetition_penalty?: number;

  /**
   * Grammar specification for guided (structured) decoding. There are two options: -
   * `ResponseFormat.json_schema`: The grammar is a JSON schema. Most providers
   * support this format. - `ResponseFormat.grammar`: The grammar is a BNF grammar.
   * This format is more flexible, but not all providers support it.
   */
  response_format?:
    | InferenceChatCompletionParams.JsonSchemaResponseFormat
    | InferenceChatCompletionParams.GrammarResponseFormat;

  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream?: boolean;

  temperature?: number;

  /**
   * Whether tool use is required or automatic. Defaults to ToolChoice.auto. ..
   * deprecated:: Use tool_config instead.
   */
  tool_choice?: 'auto' | 'required' | 'none';

  /**
   * Configuration for tool use.
   */
  tool_config?: InferenceChatCompletionParams.ToolConfig;

  /**
   * Instructs the model how to format tool calls. By default, Llama Stack will
   * attempt to use a format that is best adapted to the model. -
   * `ToolPromptFormat.json`: The tool calls are formatted as a JSON object. -
   * `ToolPromptFormat.function_tag`: The tool calls are enclosed in a
   * <function=function_name> tag. - `ToolPromptFormat.python_list`: The tool calls
   * are output as Python syntax -- a list of function calls. .. deprecated:: Use
   * tool_config instead.
   */
  tool_prompt_format?: 'json' | 'function_tag' | 'python_list';

  /**
   * List of tool definitions available to the model
   */
  tools?: Array<InferenceChatCompletionParams.Tool>;

  top_k?: number;

  top_p?: number;
}

export namespace InferenceChatCompletionParams {
  /**
   * If specified, log probabilities for each token position will be returned.
   */
  export interface Logprobs {
    /**
     * How many tokens (for each position) to return log probabilities for.
     */
    top_k?: number;
  }

  /**
   * Configuration for JSON schema-guided response generation.
   */
  export interface JsonSchemaResponseFormat {
    /**
     * The JSON schema the response should conform to. In a Python SDK, this is often a
     * `pydantic` model.
     */
    json_schema: unknown;

    /**
     * Must be "json_schema" to identify this format type
     */
    type: 'json_schema';
  }

  /**
   * Configuration for grammar-guided response generation.
   */
  export interface GrammarResponseFormat {
    /**
     * The BNF grammar specification the response should conform to
     */
    bnf: Record<string, boolean | number | string | Array<unknown> | unknown | null>;

    /**
     * Must be "grammar" to identify this format type
     */
    type: 'grammar';
  }

  /**
   * Configuration for tool use.
   */
  export interface ToolConfig {
    /**
     * Config for how to override the default system prompt. -
     * `SystemMessageBehavior.append`: Appends the provided system message to the
     * default system prompt. - `SystemMessageBehavior.replace`: Replaces the default
     * system prompt with the provided system message. The system message can include
     * the string '{{function_definitions}}' to indicate where the function definitions
     * should be inserted.
     */
    system_message_behavior?: 'append' | 'replace';

    /**
     * Whether tool use is automatic, required, or none. Can also specify a tool name
     * to use a specific tool. Defaults to ToolChoice.auto.
     */
    tool_choice?: 'auto' | 'required' | 'none' | (string & {});

    /**
     * Instructs the model how to format tool calls. By default, Llama Stack will
     * attempt to use a format that is best adapted to the model. -
     * `ToolPromptFormat.json`: The tool calls are formatted as a JSON object. -
     * `ToolPromptFormat.function_tag`: The tool calls are enclosed in a
     * <function=function_name> tag. - `ToolPromptFormat.python_list`: The tool calls
     * are output as Python syntax -- a list of function calls.
     */
    tool_prompt_format?: 'json' | 'function_tag' | 'python_list';
  }

  export interface Tool {
    tool_name: 'brave_search' | 'wolfram_alpha' | 'photogen' | 'code_interpreter' | (string & {});

    description?: string;

    parameters?: Record<string, Tool.Parameters>;
  }

  export namespace Tool {
    export interface Parameters {
      param_type: string;

      default?: boolean | number | string | Array<unknown> | unknown | null;

      description?: string;

      required?: boolean;
    }
  }

  export type InferenceChatCompletionParamsNonStreaming =
    InferenceAPI.InferenceChatCompletionParamsNonStreaming;
  export type InferenceChatCompletionParamsStreaming = InferenceAPI.InferenceChatCompletionParamsStreaming;
}

export interface InferenceChatCompletionParamsNonStreaming extends InferenceChatCompletionParamsBase {
  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream?: false;
}

export interface InferenceChatCompletionParamsStreaming extends InferenceChatCompletionParamsBase {
  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream: true;
}

export declare namespace Inference {
  export {
    type ChatCompletionRequest as ChatCompletionRequest,
    type ChatCompletionResponse as ChatCompletionResponse,
    type ChatCompletionResponseEvent as ChatCompletionResponseEvent,
    type ChatCompletionResponseStreamChunk as ChatCompletionResponseStreamChunk,
    type ContentDelta as ContentDelta,
    type ImageContentItem as ImageContentItem,
    type ReasoningContentItem as ReasoningContentItem,
    type TextContentItem as TextContentItem,
    type InferenceChatCompletionParams as InferenceChatCompletionParams,
    type InferenceChatCompletionParamsNonStreaming as InferenceChatCompletionParamsNonStreaming,
    type InferenceChatCompletionParamsStreaming as InferenceChatCompletionParamsStreaming,
  };
}
