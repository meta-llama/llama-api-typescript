// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as ChatAPI from './chat/chat';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Moderations extends APIResource {
  /**
   * Classifies if given messages are potentially harmful across several categories.
   */
  create(body: ModerationCreateParams, options?: RequestOptions): APIPromise<ModerationCreateResponse> {
    return this._client.post('/v1/moderations', { body, ...options });
  }
}

export interface ModerationCreateResponse {
  model: string;

  results: Array<unknown>;
}

export interface ModerationCreateParams {
  /**
   * List of messages in the conversation.
   */
  messages: Array<ChatAPI.Message>;

  /**
   * Optional identifier of the model to use. Defaults to "Llama-Guard".
   */
  model?: string | null;
}

export declare namespace Moderations {
  export {
    type ModerationCreateResponse as ModerationCreateResponse,
    type ModerationCreateParams as ModerationCreateParams,
  };
}
