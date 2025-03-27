// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { LlamaAPI } from '../client';

export class APIResource {
  protected _client: LlamaAPI;

  constructor(client: LlamaAPI) {
    this._client = client;
  }
}
