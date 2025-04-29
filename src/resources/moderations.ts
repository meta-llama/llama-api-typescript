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
    return this._client.post('/moderations', { body, ...options });
  }
}

export interface ModerationCreateResponse {
  model: string;

  results: Array<ModerationCreateResponse.Result>;
}

export namespace ModerationCreateResponse {
  export interface Result {
    flagged: boolean;

    flagged_categories: Array<string>;
  }
}

export interface ModerationCreateParams {
  /**
   * List of messages in the conversation.
   */
  messages: Array<ChatAPI.Message>;

  /**
   * Optional identifier of the model to use. Defaults to "Llama-Guard".
   */
  model?: string;
}

export declare namespace Moderations {
  export {
    type ModerationCreateResponse as ModerationCreateResponse,
    type ModerationCreateParams as ModerationCreateParams,
  };
}
