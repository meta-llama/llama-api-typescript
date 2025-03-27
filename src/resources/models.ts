// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Models extends APIResource {
  retrieve(modelID: string, options?: RequestOptions): APIPromise<AIModel> {
    return this._client.get(path`/v1/models/${modelID}`, options);
  }

  list(options?: RequestOptions): APIPromise<ModelListResponse> {
    return this._client.get('/v1/models', options);
  }
}

export interface AIModel {
  identifier: string;

  metadata: Record<string, boolean | number | string | Array<unknown> | unknown | null>;

  model_type: 'llm' | 'embedding';

  provider_id: string;

  provider_resource_id: string;

  type: 'model';
}

export interface ModelListResponse {
  data: Array<AIModel>;
}

export declare namespace Models {
  export { type AIModel as AIModel, type ModelListResponse as ModelListResponse };
}
