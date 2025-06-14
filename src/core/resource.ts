// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { LlamaAPIClient } from '../client';

export abstract class APIResource {
  protected _client: LlamaAPIClient;

  constructor(client: LlamaAPIClient) {
    this._client = client;
  }
}
