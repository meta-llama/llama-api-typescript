// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import * as InferenceAPI from './inference';

/**
 * A message containing the model's (assistant) response in a chat conversation.
 */
export interface CompletionMessage {
  /**
   * The content of the model's response
   */
  content:
    | string
    | InferenceAPI.ImageContentItem
    | InferenceAPI.TextContentItem
    | InferenceAPI.ReasoningContentItem;

  /**
   * Must be "assistant" to identify this as the model's response
   */
  role: 'assistant';

  /**
   * Reason why the model stopped generating. Options are: -
   * `StopReason.end_of_turn`: The model finished generating the entire response. -
   * `StopReason.end_of_message`: The model finished generating but generated a
   * partial response -- usually, a tool call. The user may call the tool and
   * continue the conversation with the tool's response. -
   * `StopReason.out_of_tokens`: The model ran out of token budget.
   */
  stop_reason: 'end_of_turn' | 'end_of_message' | 'out_of_tokens';

  /**
   * List of tool calls. Each tool call is a ToolCall object.
   */
  tool_calls?: Array<CompletionMessage.ToolCall>;
}

export namespace CompletionMessage {
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

/**
 * A message from the user in a chat conversation.
 */
export type Message = UserMessage | SystemMessage | ToolResponseMessage | CompletionMessage;

/**
 * A system message providing instructions or context to the model.
 */
export interface SystemMessage {
  /**
   * The content of the "system prompt". If multiple system messages are provided,
   * they are concatenated.
   */
  content:
    | string
    | Array<InferenceAPI.ImageContentItem | InferenceAPI.TextContentItem | InferenceAPI.ReasoningContentItem>;

  /**
   * Must be "system" to identify this as a system message
   */
  role: 'system';
}

/**
 * A message representing the result of a tool invocation.
 */
export interface ToolResponseMessage {
  /**
   * Unique identifier for the tool call this response is for
   */
  call_id: string;

  /**
   * The response content from the tool
   */
  content:
    | string
    | Array<InferenceAPI.ImageContentItem | InferenceAPI.TextContentItem | InferenceAPI.ReasoningContentItem>;

  /**
   * Must be "tool" to identify this as a tool response
   */
  role: 'tool';
}

/**
 * A message from the user in a chat conversation.
 */
export interface UserMessage {
  /**
   * The content of the message, which can include text and other media
   */
  content:
    | string
    | Array<InferenceAPI.ImageContentItem | InferenceAPI.TextContentItem | InferenceAPI.ReasoningContentItem>;

  /**
   * Must be "user" to identify this as a user message
   */
  role: 'user';
}
