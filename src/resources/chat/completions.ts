// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as CompletionsAPI from './completions';
import * as ChatAPI from './chat';
import { APIPromise } from '../../core/api-promise';
import { Stream } from '../../core/streaming';
import { RequestOptions } from '../../internal/request-options';

export class Completions extends APIResource {
  /**
   * Generate a chat completion for the given messages using the specified model.
   */
  create(
    body: CompletionCreateParamsNonStreaming,
    options?: RequestOptions,
  ): APIPromise<ChatAPI.CreateChatCompletionResponse>;
  create(
    body: CompletionCreateParamsStreaming,
    options?: RequestOptions,
  ): APIPromise<Stream<ChatAPI.CreateChatCompletionResponseStreamChunk>>;
  create(
    body: CompletionCreateParamsBase,
    options?: RequestOptions,
  ): APIPromise<
    Stream<ChatAPI.CreateChatCompletionResponseStreamChunk> | ChatAPI.CreateChatCompletionResponse
  >;
  create(
    body: CompletionCreateParams,
    options?: RequestOptions,
  ):
    | APIPromise<ChatAPI.CreateChatCompletionResponse>
    | APIPromise<Stream<ChatAPI.CreateChatCompletionResponseStreamChunk>> {
    if (body.stream) {
      options = {
        ...options,
        headers: {
          ...options?.headers,
          Accept: 'text/event-stream',
        },
      };
    }
    return this._client.post('/chat/completions', { body, ...options, stream: body.stream ?? false }) as
      | APIPromise<ChatAPI.CreateChatCompletionResponse>
      | APIPromise<Stream<ChatAPI.CreateChatCompletionResponseStreamChunk>>;
  }
}

export type CompletionCreateParams = CompletionCreateParamsNonStreaming | CompletionCreateParamsStreaming;

export interface CompletionCreateParamsBase {
  /**
   * List of messages in the conversation.
   */
  messages: Array<ChatAPI.Message>;

  /**
   * The identifier of the model to use.
   */
  model: string;

  /**
   * The maximum number of tokens to generate.
   */
  max_completion_tokens?: number;

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
    | CompletionCreateParams.JsonSchemaResponseFormat
    | CompletionCreateParams.TextResponseFormat;

  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream?: boolean;

  /**
   * Controls randomness of the response by setting a temperature. Higher value leads
   * to more creative responses. Lower values will make the response more focused and
   * deterministic.
   */
  temperature?: number;

  /**
   * List of tool definitions available to the model
   */
  tools?: Array<CompletionCreateParams.Tool>;

  /**
   * Only sample from the top K options for each subsequent token.
   */
  top_k?: number;

  /**
   * Controls diversity of the response by setting a probability threshold when
   * choosing the next token.
   */
  top_p?: number;
}

export namespace CompletionCreateParams {
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
      strict?: boolean;
    }
  }

  export type CompletionCreateParamsNonStreaming = CompletionsAPI.CompletionCreateParamsNonStreaming;
  export type CompletionCreateParamsStreaming = CompletionsAPI.CompletionCreateParamsStreaming;
}

export interface CompletionCreateParamsNonStreaming extends CompletionCreateParamsBase {
  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream?: false;
}

export interface CompletionCreateParamsStreaming extends CompletionCreateParamsBase {
  /**
   * If True, generate an SSE event stream of the response. Defaults to False.
   */
  stream: true;
}

export declare namespace Completions {
  export {
    type CompletionCreateParams as CompletionCreateParams,
    type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming,
    type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming,
  };
}
