import {
    LlamaAPIClientError,
    APIError,
    APIUserAbortError,
    APIConnectionError,
    APIConnectionTimeoutError,
    BadRequestError,
    AuthenticationError,
    PermissionDeniedError,
    NotFoundError,
    ConflictError,
    UnprocessableEntityError,
    RateLimitError,
    InternalServerError,
  } from '../../src/core/error';
  
  describe('LlamaAPIClientError', () => {
    it('should create an instance of LlamaAPIClientError', () => {
      const error = new LlamaAPIClientError();
      expect(error).toBeInstanceOf(LlamaAPIClientError);
      expect(error).toBeInstanceOf(Error);
    });
  });
  
  describe('APIError', () => {
    it('should create an APIError with all parameters', () => {
      const status = 400;
      const headers = new Headers();
      const error = { message: 'Bad request' };
      const message = 'Custom error message';
  
      const apiError = new APIError(status, error, message, headers);
  
      expect(apiError).toBeInstanceOf(APIError);
      expect(apiError).toBeInstanceOf(LlamaAPIClientError);
      expect(apiError.status).toBe(status);
      expect(apiError.headers).toBe(headers);
      expect(apiError.error).toBe(error);
      expect(apiError.message).toContain('400');
      expect(apiError.message).toContain('Bad request');
    });
  
    it('should create an APIError with only status', () => {
      const status = 500;
      const apiError = new APIError(status, undefined, undefined, undefined);
  
      expect(apiError.status).toBe(status);
      expect(apiError.message).toContain('500 status code (no body)');
    });
  
    it('should create an APIError with only message', () => {
      const message = 'Something went wrong';
      const apiError = new APIError(undefined, undefined, message, undefined);
  
      expect(apiError.message).toBe(message);
    });
  
    it('should create an APIError with no parameters', () => {
      const apiError = new APIError(undefined, undefined, undefined, undefined);
  
      expect(apiError.message).toBe('(no status code or body)');
    });
  
    it('should handle errors with string message', () => {
      const error = { message: 'String message' };
      const apiError = new APIError(400, error, undefined, undefined);
  
      expect(apiError.message).toContain('String message');
    });
  
    it('should handle errors with non-string message', () => {
      const error = { message: { detail: 'Complex message' } };
      const apiError = new APIError(400, error, undefined, undefined);
  
      expect(apiError.message).toContain('{"detail":"Complex message"}');
    });
  
    it('should prioritize error.message over custom message parameter', () => {
      const error = { message: 'Error from API' };
      const customMessage = 'Custom message that should be ignored';
      const apiError = new APIError(400, error, customMessage, undefined);
  
      expect(apiError.message).toContain('Error from API');
      expect(apiError.message).not.toContain('Custom message that should be ignored');
    });
  
    it('should stringify error object when error has no message property but error exists', () => {
      const error = { someOtherProperty: 'value' };
      const customMessage = 'Custom message';
      const apiError = new APIError(400, error, customMessage, undefined);
  
      expect(apiError.message).toContain('{"someOtherProperty":"value"}');
      expect(apiError.message).not.toContain('Custom message');
    });
  
    it('should use custom message only when error is undefined or null', () => {
      const customMessage = 'Custom message';
      const apiError = new APIError(400, undefined, customMessage, undefined);
  
      expect(apiError.message).toContain('Custom message');
    });
  
    it('should stringify error object when no message property exists', () => {
      const error = { code: 123, details: 'Some details' };
      const apiError = new APIError(400, error, undefined, undefined);
  
      expect(apiError.message).toContain('{"code":123,"details":"Some details"}');
    });
  });
  
  describe('APIError.generate', () => {
    it('should generate a BadRequestError for status 400', () => {
      const error = APIError.generate(400, { message: 'Bad request' }, undefined, new Headers());
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.status).toBe(400);
    });
  
    it('should generate an AuthenticationError for status 401', () => {
      const error = APIError.generate(401, { message: 'Unauthorized' }, undefined, new Headers());
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.status).toBe(401);
    });
  
    it('should generate a PermissionDeniedError for status 403', () => {
      const error = APIError.generate(403, { message: 'Forbidden' }, undefined, new Headers());
      expect(error).toBeInstanceOf(PermissionDeniedError);
      expect(error.status).toBe(403);
    });
  
    it('should generate a NotFoundError for status 404', () => {
      const error = APIError.generate(404, { message: 'Not found' }, undefined, new Headers());
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.status).toBe(404);
    });
  
    it('should generate a ConflictError for status 409', () => {
      const error = APIError.generate(409, { message: 'Conflict' }, undefined, new Headers());
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.status).toBe(409);
    });
  
    it('should generate an UnprocessableEntityError for status 422', () => {
      const error = APIError.generate(422, { message: 'Unprocessable' }, undefined, new Headers());
      expect(error).toBeInstanceOf(UnprocessableEntityError);
      expect(error.status).toBe(422);
    });
  
    it('should generate a RateLimitError for status 429', () => {
      const error = APIError.generate(429, { message: 'Rate limited' }, undefined, new Headers());
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.status).toBe(429);
    });
  
    it('should generate an InternalServerError for status >= 500', () => {
      const error = APIError.generate(500, { message: 'Server error' }, undefined, new Headers());
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error.status).toBe(500);
    });
  
    it('should generate an InternalServerError for status 502', () => {
      const error = APIError.generate(502, { message: 'Bad gateway' }, undefined, new Headers());
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error.status).toBe(502);
    });
  
    it('should generate a generic APIError for other status codes', () => {
      const error = APIError.generate(418, { message: 'I\'m a teapot' }, undefined, new Headers());
      expect(error).toBeInstanceOf(APIError);
      expect(error.status).toBe(418);
    });
  
    it('should generate an APIConnectionError when status or headers are missing', () => {
      const error = APIError.generate(undefined, { message: 'Connection error' }, undefined, undefined);
      expect(error).toBeInstanceOf(APIConnectionError);
    });
  });
  
  describe('APIUserAbortError', () => {
    it('should create an APIUserAbortError with default message', () => {
      const error = new APIUserAbortError();
      expect(error).toBeInstanceOf(APIUserAbortError);
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Request was aborted.');
    });
  
    it('should create an APIUserAbortError with custom message', () => {
      const customMessage = 'User cancelled the request';
      const error = new APIUserAbortError({ message: customMessage });
      expect(error.message).toBe(customMessage);
    });
  });
  
  describe('APIConnectionError', () => {
    it('should create an APIConnectionError with default message', () => {
      const error = new APIConnectionError({ message: 'Connection error.' });
      expect(error).toBeInstanceOf(APIConnectionError);
      expect(error).toBeInstanceOf(APIError);
      expect(error.message).toBe('Connection error.');
    });
  
    it('should create an APIConnectionError with custom message', () => {
      const customMessage = 'Network is down';
      const error = new APIConnectionError({ message: customMessage });
      expect(error.message).toBe(customMessage);
    });
  
    it('should create an APIConnectionError with cause', () => {
      const cause = new Error('Original error');
      const error = new APIConnectionError({ cause });
      expect(error.message).toBe('Connection error.');
      // @ts-ignore - cause property exists
      expect(error.cause).toBe(cause);
    });
  });
  
  describe('APIConnectionTimeoutError', () => {
    it('should create an APIConnectionTimeoutError with default message', () => {
      const error = new APIConnectionTimeoutError();
      expect(error).toBeInstanceOf(APIConnectionTimeoutError);
      expect(error).toBeInstanceOf(APIConnectionError);
      expect(error.message).toBe('Request timed out.');
    });
  
    it('should create an APIConnectionTimeoutError with custom message', () => {
      const customMessage = 'Request took too long';
      const error = new APIConnectionTimeoutError({ message: customMessage });
      expect(error.message).toBe(customMessage);
    });
  });
  
  describe('Specific error classes', () => {
    it('should create instances of specific error classes', () => {
      const headers = new Headers();
      const error = { message: 'Test error' };
  
      expect(new BadRequestError(400, error, undefined, headers)).toBeInstanceOf(BadRequestError);
      expect(new AuthenticationError(401, error, undefined, headers)).toBeInstanceOf(AuthenticationError);
      expect(new PermissionDeniedError(403, error, undefined, headers)).toBeInstanceOf(PermissionDeniedError);
      expect(new NotFoundError(404, error, undefined, headers)).toBeInstanceOf(NotFoundError);
      expect(new ConflictError(409, error, undefined, headers)).toBeInstanceOf(ConflictError);
      expect(new UnprocessableEntityError(422, error, undefined, headers)).toBeInstanceOf(UnprocessableEntityError);
      expect(new RateLimitError(429, error, undefined, headers)).toBeInstanceOf(RateLimitError);
      expect(new InternalServerError(500, error, undefined, headers)).toBeInstanceOf(InternalServerError);
    });
  });