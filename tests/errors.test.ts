import {
  LlamaAPIClientError,
  APIError,
  APIConnectionError,
  APIConnectionTimeoutError,
  APIUserAbortError,
  BadRequestError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  RateLimitError,
  InternalServerError,
} from 'llama-api-client';

describe('APIError.generate()', () => {
  const headers = new Headers({ 'x-request-id': 'req_123' });
  const errorResponse = { message: 'something went wrong' };

  test('400 → BadRequestError', () => {
    const error = APIError.generate(400, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(BadRequestError);
    expect(error).toBeInstanceOf(APIError);
  });

  test('401 → AuthenticationError', () => {
    const error = APIError.generate(401, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(AuthenticationError);
  });

  test('403 → PermissionDeniedError', () => {
    const error = APIError.generate(403, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(PermissionDeniedError);
  });

  test('404 → NotFoundError', () => {
    const error = APIError.generate(404, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  test('409 → ConflictError', () => {
    const error = APIError.generate(409, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(ConflictError);
  });

  test('422 → UnprocessableEntityError', () => {
    const error = APIError.generate(422, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(UnprocessableEntityError);
  });

  test('429 → RateLimitError', () => {
    const error = APIError.generate(429, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(RateLimitError);
  });

  test('500 → InternalServerError', () => {
    const error = APIError.generate(500, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(InternalServerError);
  });

  test('503 (any 5xx) → InternalServerError', () => {
    const error = APIError.generate(503, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(InternalServerError);
  });

  test('418 (unknown status) → APIError', () => {
    const error = APIError.generate(418, errorResponse, undefined, headers);
    expect(error).toBeInstanceOf(APIError);
    expect(error).not.toBeInstanceOf(BadRequestError);
    expect(error).not.toBeInstanceOf(InternalServerError);
  });

  test('missing status and headers → APIConnectionError', () => {
    const error = APIError.generate(undefined, errorResponse, 'connection failed', undefined);
    expect(error).toBeInstanceOf(APIConnectionError);
  });
});

describe('Error properties', () => {
  test('status, headers, error, and message are correctly set', () => {
    const headers = new Headers({ 'x-request-id': 'req_456' });
    const errorBody = { message: 'bad request detail' };
    const error = APIError.generate(400, errorBody, 'fallback message', headers);

    expect(error.status).toBe(400);
    expect(error.headers).toBe(headers);
    expect(error.error).toEqual(errorBody);
    expect(error.message).toContain('bad request detail');
  });

  test('message falls back when error has no message property', () => {
    const headers = new Headers();
    const errorBody = { code: 'invalid' };
    const error = APIError.generate(422, errorBody, 'fallback msg', headers);

    expect(error.status).toBe(422);
    expect(error.message).toContain(JSON.stringify(errorBody));
  });

  test('message uses fallback string when no error body', () => {
    const headers = new Headers();
    const error = APIError.generate(404, undefined, 'not found here', headers);

    expect(error.status).toBe(404);
    expect(error.message).toContain('not found here');
  });

  test('all error subclasses extend LlamaAPIClientError', () => {
    const headers = new Headers();
    const err = APIError.generate(400, {}, undefined, headers);
    expect(err).toBeInstanceOf(LlamaAPIClientError);
    expect(err).toBeInstanceOf(Error);
  });
});

describe('APIConnectionError', () => {
  test('has cause and no status', () => {
    const cause = new Error('ECONNREFUSED');
    const error = new APIConnectionError({ message: 'could not connect', cause });

    expect(error).toBeInstanceOf(APIConnectionError);
    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBeUndefined();
    expect((error as any).cause).toBe(cause);
    expect(error.message).toBe('could not connect');
  });

  test('defaults message to "Connection error."', () => {
    const error = new APIConnectionError({});
    expect(error.message).toBe('Connection error.');
  });
});

describe('APIConnectionTimeoutError', () => {
  test('extends APIConnectionError', () => {
    const error = new APIConnectionTimeoutError();

    expect(error).toBeInstanceOf(APIConnectionTimeoutError);
    expect(error).toBeInstanceOf(APIConnectionError);
    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBeUndefined();
    expect(error.message).toBe('Request timed out.');
  });

  test('accepts custom message', () => {
    const error = new APIConnectionTimeoutError({ message: 'custom timeout' });
    expect(error.message).toBe('custom timeout');
  });
});

describe('APIUserAbortError', () => {
  test('status is undefined', () => {
    const error = new APIUserAbortError();

    expect(error).toBeInstanceOf(APIUserAbortError);
    expect(error).toBeInstanceOf(APIError);
    expect(error.status).toBeUndefined();
    expect(error.message).toBe('Request was aborted.');
  });

  test('accepts custom message', () => {
    const error = new APIUserAbortError({ message: 'user cancelled' });
    expect(error.message).toBe('user cancelled');
  });
});
