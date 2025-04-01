// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Models extends APIResource {
  retrieve(model: string, options?: RequestOptions): APIPromise<AIModel> {
    return this._client.get(path`/v1/models/${model}`, options);
  }

  /**
   * Lists the currently available models, and provides basic information about each
   * one.
   */
  list(options?: RequestOptions): APIPromise<ModelListResponse> {
    return this._client.get('/v1/models', options);
  }
}

export interface AIModel {
  /**
   * The unique model identifier, which can be referenced in the API.
   */
  id: string;

  /**
   * The creation time of the model.
   */
  created: number;

  /**
   * The object type, which is always "model"
   */
  object: 'model';

  /**
   * The owner of the model.
   */
  owned_by: string;
}

export interface ModelListResponse {
  data: Array<AIModel>;

  object?: 'list';
}

export declare namespace Models {
  export { type AIModel as AIModel, type ModelListResponse as ModelListResponse };
}
