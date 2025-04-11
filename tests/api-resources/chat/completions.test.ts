// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import LlamaAPIClient from 'llama-api-client';

const client = new LlamaAPIClient({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource completions', () => {
  // skipped: tests are disabled for the time being
  test.skip('create: only required params', async () => {
    const responsePromise = client.chat.completions.create({
      messages: [{ content: 'string', role: 'user' }],
      model: 'model',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // skipped: tests are disabled for the time being
  test.skip('create: required and optional params', async () => {
    const response = await client.chat.completions.create({
      messages: [{ content: 'string', role: 'user' }],
      model: 'model',
      max_completion_tokens: 1,
      repetition_penalty: 1,
      response_format: { json_schema: { name: 'name', schema: {} }, type: 'json_schema' },
      stream: false,
      temperature: 0.6,
      tool_choice: 'none',
      tools: [
        {
          function: { name: 'name', description: 'description', parameters: { foo: 'bar' }, strict: true },
          type: 'function',
        },
      ],
      top_k: 0,
      top_p: 0.9,
    });
  });
});
