// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ChatAPI from './chat';
import * as CompletionsAPI from './completions';
import {
  CompletionCreateParams,
  CompletionCreateParamsNonStreaming,
  CompletionCreateParamsStreaming,
  Completions,
} from './completions';

export class Chat extends APIResource {
  completions: CompletionsAPI.Completions = new CompletionsAPI.Completions(this._client);
}

export interface CreateChatCompletionRequest {
  /**
   * List of messages in the conversation.
   */
  messages: Array<
    | CreateChatCompletionRequest.UserMessage
    | CreateChatCompletionRequest.SystemMessage
    | CreateChatCompletionRequest.ToolResponseMessage
    | CreateChatCompletionRequest.AssistantMessage
  >;

  /**
   * The identifier of the model to use.
   */
  model: string;

  /**
   * The maximum number of tokens to generate.
   */
  max_completion_tokens?: number | null;

  /**
   * Controls the likelyhood and generating repetitive responses.
   */
  repetition_penalty?: number;

  /**
   * An object specifying the format that the model must output. Setting to
   * `{ "type": "json_schema", "json_schema": {...} }` enables Structured Outputs
   * which ensures the model will match your supplied JSON schema. If not specified,
   * the default is {"type": "text"}, and model will return a free-form text
   * response.
   */
  response_format?:
    | CreateChatCompletionRequest.JsonSchemaResponseFormat
    | CreateChatCompletionRequest.TextResponseFormat;

  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream?: boolean;

  /**
   * Controls randomness of the response by setting a temperature. Higher value leads
   * to more creative responses. Lower values will make the response more focused and
   * deterministic.
   */
  temperature?: number | null;

  /**
   * Controls which (if any) tool is called by the model. `none` means the model will
   * not call any tool and instead generates a message. `auto` means the model can
   * pick between generating a message or calling one or more tools. `required` means
   * the model must call one or more tools. Specifying a particular tool via
   * `{"type": "function", "function": {"name": "my_function"}}` forces the model to
   * call that tool.
   *
   * `none` is the default when no tools are present. `auto` is the default if tools
   * are present.
   */
  tool_choice?: 'none' | 'auto' | 'required' | CreateChatCompletionRequest.ChatCompletionNamedToolChoice;

  /**
   * List of tool definitions available to the model
   */
  tools?: Array<CreateChatCompletionRequest.Tool>;

  /**
   * Only sample from the top K options for each subsequent token.
   */
  top_k?: number;

  /**
   * Controls diversity of the response by setting a probability threshold when
   * choosing the next token.
   */
  top_p?: number | null;
}

export namespace CreateChatCompletionRequest {
  /**
   * A message from the user in a chat conversation.
   */
  export interface UserMessage {
    /**
     * The content of the user message, which can include text and other media.
     */
    content: string | Array<ChatAPI.MessageTextContentItem | ChatAPI.MessageImageContentItem>;

    /**
     * Must be "user" to identify this as a user message.
     */
    role: 'user';
  }

  /**
   * A system message providing instructions or context to the model.
   */
  export interface SystemMessage {
    /**
     * The content of the system message.
     */
    content: string | Array<ChatAPI.MessageTextContentItem>;

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
     * The content of the user message, which can include text and other media.
     */
    content: string | Array<ChatAPI.MessageTextContentItem>;

    /**
     * Must be "tool" to identify this as a tool response
     */
    role: 'tool';

    /**
     * Unique identifier for the tool call this response is for
     */
    tool_call_id: string;
  }

  /**
   * A message containing the model's (assistant) response in a chat conversation.
   */
  export interface AssistantMessage {
    /**
     * The content of the model's response.
     */
    content: string | ChatAPI.MessageTextContentItem | ChatAPI.MessageReasoningContentItem;

    /**
     * Must be "assistant" to identify this as the model's response
     */
    role: 'assistant';

    /**
     * The reason why we stopped. Options are: - "stop": The model reached a natural
     * stopping point. - "tool_calls": The model finished generating and invoked a tool
     * call. - "length": The model reached the maxinum number of tokens specified in
     * the request.
     */
    stop_reason: 'stop' | 'tool_calls' | 'length';

    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: Array<AssistantMessage.ToolCall>;
  }

  export namespace AssistantMessage {
    export interface ToolCall {
      /**
       * The ID of the tool call.
       */
      id: string;

      /**
       * The function that the model called.
       */
      function: ToolCall.Function;
    }

    export namespace ToolCall {
      /**
       * The function that the model called.
       */
      export interface Function {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments: string;

        /**
         * The name of the function to call.
         */
        name: string;
      }
    }
  }

  /**
   * Configuration for JSON schema-guided response generation.
   */
  export interface JsonSchemaResponseFormat {
    /**
     * The JSON schema the response should conform to.
     */
    json_schema: JsonSchemaResponseFormat.JsonSchema;

    /**
     * The type of response format being defined. Always `json_schema`.
     */
    type: 'json_schema';
  }

  export namespace JsonSchemaResponseFormat {
    /**
     * The JSON schema the response should conform to.
     */
    export interface JsonSchema {
      /**
       * The name of the response format.
       */
      name: string;

      /**
       * The JSON schema the response should conform to. In a Python SDK, this is often a
       * `pydantic` model.
       */
      schema: unknown;
    }
  }

  /**
   * Configuration for text-guided response generation.
   */
  export interface TextResponseFormat {
    /**
     * The type of response format being defined. Always `text`.
     */
    type: 'text';
  }

  /**
   * Specifies a tool the model should use. Use to force the model to call a specific
   * function.
   */
  export interface ChatCompletionNamedToolChoice {
    function: ChatCompletionNamedToolChoice.Function;

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: 'function';
  }

  export namespace ChatCompletionNamedToolChoice {
    export interface Function {
      /**
       * The name of the function to call.
       */
      name: string;
    }
  }

  export interface Tool {
    function: Tool.Function;

    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type: 'function';
  }

  export namespace Tool {
    export interface Function {
      /**
       * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain
       * underscores and dashes, with a maximum length of 64.
       */
      name: string;

      /**
       * A description of what the function does, used by the model to choose when and
       * how to call the function.
       */
      description?: string;

      /**
       * The parameters the functions accepts, described as a JSON Schema object.
       * Omitting `parameters` defines a function with an empty parameter list.
       */
      parameters?: Record<string, unknown>;

      /**
       * Whether to enable strict schema adherence when generating the function call. If
       * set to true, the model will follow the exact schema defined in the `parameters`
       * field. Only a subset of JSON Schema is supported when `strict` is `true`. Learn
       * more about Structured Outputs in the
       * [function calling guide](docs/guides/function-calling).
       */
      strict?: boolean | null;
    }
  }
}

/**
 * Response from a chat completion request.
 */
export interface CreateChatCompletionResponse {
  /**
   * The complete response message
   */
  completion_message: CreateChatCompletionResponse.CompletionMessage;

  metrics?: Array<CreateChatCompletionResponse.Metric>;
}

export namespace CreateChatCompletionResponse {
  /**
   * The complete response message
   */
  export interface CompletionMessage {
    /**
     * The content of the model's response.
     */
    content: string | ChatAPI.MessageTextContentItem | ChatAPI.MessageReasoningContentItem;

    /**
     * Must be "assistant" to identify this as the model's response
     */
    role: 'assistant';

    /**
     * The reason why we stopped. Options are: - "stop": The model reached a natural
     * stopping point. - "tool_calls": The model finished generating and invoked a tool
     * call. - "length": The model reached the maxinum number of tokens specified in
     * the request.
     */
    stop_reason: 'stop' | 'tool_calls' | 'length';

    /**
     * The tool calls generated by the model, such as function calls.
     */
    tool_calls?: Array<CompletionMessage.ToolCall>;
  }

  export namespace CompletionMessage {
    export interface ToolCall {
      /**
       * The ID of the tool call.
       */
      id: string;

      /**
       * The function that the model called.
       */
      function: ToolCall.Function;
    }

    export namespace ToolCall {
      /**
       * The function that the model called.
       */
      export interface Function {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments: string;

        /**
         * The name of the function to call.
         */
        name: string;
      }
    }
  }

  export interface Metric {
    metric: string;

    value: number;

    unit?: string;
  }
}

/**
 * A chunk of a streamed chat completion response.
 */
export interface CreateChatCompletionResponseStreamChunk {
  /**
   * The event containing the new content
   */
  event: CreateChatCompletionResponseStreamChunk.Event;

  metrics?: Array<CreateChatCompletionResponseStreamChunk.Metric>;
}

export namespace CreateChatCompletionResponseStreamChunk {
  /**
   * The event containing the new content
   */
  export interface Event {
    /**
     * Content generated since last event. This can be one or more tokens, or a tool
     * call.
     */
    delta: Event.TextDelta | Event.ToolCallDelta | Event.ReasoningDelta;

    /**
     * Type of the event
     */
    event_type: 'start' | 'complete' | 'progress';

    /**
     * The reason why we stopped. Options are: - "stop": The model reached a natural
     * stopping point. - "tool_calls": The model finished generating and invoked a tool
     * call. - "length": The model reached the maxinum number of tokens specified in
     * the request.
     */
    stop_reason?: 'stop' | 'tool_calls' | 'length';
  }

  export namespace Event {
    export interface TextDelta {
      text: string;

      type: 'text';
    }

    export interface ToolCallDelta {
      function: ToolCallDelta.Function;

      type: 'tool_call';

      /**
       * The ID of the tool call.
       */
      id?: string;
    }

    export namespace ToolCallDelta {
      export interface Function {
        /**
         * The arguments to call the function with, as generated by the model in JSON
         * format. Note that the model does not always generate valid JSON, and may
         * hallucinate parameters not defined by your function schema. Validate the
         * arguments in your code before calling your function.
         */
        arguments?: string;

        /**
         * The name of the function to call.
         */
        name?: string;
      }
    }

    export interface ReasoningDelta {
      answer: string;

      reasoning: string;

      type: 'reasoning';
    }
  }

  export interface Metric {
    metric: string;

    value: number;

    unit?: string;
  }
}

/**
 * A image content item
 */
export interface MessageImageContentItem {
  /**
   * Contains either an image URL or a data URL for a base64 encoded image.
   */
  image_url: MessageImageContentItem.ImageURL;

  /**
   * Discriminator type of the content item. Always "image"
   */
  type: 'image';
}

export namespace MessageImageContentItem {
  /**
   * Contains either an image URL or a data URL for a base64 encoded image.
   */
  export interface ImageURL {
    /**
     * Either a URL of the image or the base64 encoded image data.
     */
    url: string;
  }
}

/**
 * A reasoning content item
 */
export interface MessageReasoningContentItem {
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
export interface MessageTextContentItem {
  /**
   * Text content
   */
  text: string;

  /**
   * Discriminator type of the content item. Always "text"
   */
  type: 'text';
}

Chat.Completions = Completions;

export declare namespace Chat {
  export {
    type CreateChatCompletionRequest as CreateChatCompletionRequest,
    type CreateChatCompletionResponse as CreateChatCompletionResponse,
    type CreateChatCompletionResponseStreamChunk as CreateChatCompletionResponseStreamChunk,
    type MessageImageContentItem as MessageImageContentItem,
    type MessageReasoningContentItem as MessageReasoningContentItem,
    type MessageTextContentItem as MessageTextContentItem,
  };

  export {
    Completions as Completions,
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}
