// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LlamaAPIClient, { toFile } from 'llama-api-client';

const client = new LlamaAPIClient({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource uploads', () => {
  // Prism tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.uploads.create({
      bytes: 0,
      filename: 'filename',
      mime_type: 'image/jpeg',
      purpose: 'attachment',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.uploads.create({
      bytes: 0,
      filename: 'filename',
      mime_type: 'image/jpeg',
      purpose: 'attachment',
      'X-API-Version': '1.0.0',
    });
  });

  // Prism tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.uploads.get('upload_id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('get: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.uploads.get('upload_id', { 'X-API-Version': '1.0.0' }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(LlamaAPIClient.NotFoundError);
  });

  // Prism tests are disabled
  test.skip('part: only required params', async () => {
    const responsePromise = client.uploads.part('upload_id', {
      data: await toFile(Buffer.from('# my file contents'), 'README.md'),
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('part: required and optional params', async () => {
    const response = await client.uploads.part('upload_id', {
      data: await toFile(Buffer.from('# my file contents'), 'README.md'),
      'X-API-Version': '1.0.0',
      'X-Upload-Offset': 0,
    });
  });
});
