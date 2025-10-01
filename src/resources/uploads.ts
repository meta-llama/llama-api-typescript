// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { type Uploadable } from '../core/uploads';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { multipartFormRequestOptions } from '../internal/uploads';
import { path } from '../internal/utils/path';

export class Uploads extends APIResource {
  /**
   * Initiate an upload session with specified file metadata
   */
  create(params: UploadCreateParams, options?: RequestOptions): APIPromise<UploadCreateResponse> {
    const { 'X-API-Version': xAPIVersion, ...body } = params;
    return this._client.post('/uploads', {
      body,
      ...options,
      headers: buildHeaders([
        { ...(xAPIVersion?.toString() != null ? { 'X-API-Version': xAPIVersion?.toString() } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Get the status of the given upload session
   */
  get(
    uploadID: string,
    params: UploadGetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<UploadGetResponse> {
    const { 'X-API-Version': xAPIVersion } = params ?? {};
    return this._client.get(path`/uploads/${uploadID}`, {
      ...options,
      headers: buildHeaders([
        { ...(xAPIVersion?.toString() != null ? { 'X-API-Version': xAPIVersion?.toString() } : undefined) },
        options?.headers,
      ]),
    });
  }

  /**
   * Upload a chunk of bytes to the upload session
   */
  part(uploadID: string, params: UploadPartParams, options?: RequestOptions): APIPromise<UploadPartResponse> {
    const { 'X-API-Version': xAPIVersion, 'X-Upload-Offset': xUploadOffset, ...body } = params;
    return this._client.post(
      path`/uploads/${uploadID}`,
      multipartFormRequestOptions(
        {
          body,
          ...options,
          headers: buildHeaders([
            {
              ...(xAPIVersion?.toString() != null ? { 'X-API-Version': xAPIVersion?.toString() } : undefined),
              ...(xUploadOffset?.toString() != null ?
                { 'X-Upload-Offset': xUploadOffset?.toString() }
              : undefined),
            },
            options?.headers,
          ]),
        },
        this._client,
      ),
    );
  }
}

export interface UploadCreateResponse {
  /**
   * The unique upload session identifier to use for uploading the file
   */
  id: string;

  /**
   * The number of bytes in the file you are uploading
   */
  bytes: number;

  /**
   * The name of the file to upload
   */
  filename: string;

  /**
   * The MIME type of the file. Must be one of the supported MIME type for the given
   * purpose.
   */
  mime_type:
    | 'image/jpeg'
    | 'image/jpg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp'
    | 'image/x-icon'
    | 'audio/mp3'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/x-wav'
    | 'application/jsonl'
    | 'application/json'
    | 'text/plain'
    | 'video/mp4'
    | 'application/pdf';

  /**
   * Intended purpose of the uploaded file.
   */
  purpose:
    | 'attachment'
    | 'ephemeral_attachment'
    | 'image_generation_result'
    | 'messages_finetune'
    | 'messages_eval'
    | 'metadata';
}

export interface UploadGetResponse {
  /**
   * The unique upload session identifier to use for uploading the file
   */
  upload_id: string;

  /**
   * This is a zero-based numeric index of byte number in which the current upload
   * session to be resuming upload from
   */
  offset?: number;
}

export interface UploadPartResponse {
  /**
   * The unique upload session identifier to use for uploading the file
   */
  upload_id: string;

  /**
   * The ready file identifier after the upload is complete
   */
  file_id?: string;

  /**
   * This is a zero-based numeric index of byte number in which the current upload
   * session to be resuming upload from
   */
  offset?: number;
}

export interface UploadCreateParams {
  /**
   * Body param: The number of bytes in the file you are uploading
   */
  bytes: number;

  /**
   * Body param: The name of the file to upload
   */
  filename: string;

  /**
   * Body param: The MIME type of the file. Must be one of the supported MIME type
   * for the given purpose.
   */
  mime_type:
    | 'image/jpeg'
    | 'image/jpg'
    | 'image/png'
    | 'image/gif'
    | 'image/webp'
    | 'image/x-icon'
    | 'audio/mp3'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/x-wav'
    | 'application/jsonl'
    | 'application/json'
    | 'text/plain'
    | 'video/mp4'
    | 'application/pdf';

  /**
   * Body param: Intended purpose of the uploaded file.
   */
  purpose:
    | 'attachment'
    | 'ephemeral_attachment'
    | 'image_generation_result'
    | 'messages_finetune'
    | 'messages_eval'
    | 'metadata';

  /**
   * Header param:
   */
  'X-API-Version'?: '1.0.0';
}

export interface UploadGetParams {
  'X-API-Version'?: '1.0.0';
}

export interface UploadPartParams {
  /**
   * Body param: The chunk of bytes to upload
   */
  data: Uploadable;

  /**
   * Header param:
   */
  'X-API-Version'?: '1.0.0';

  /**
   * Header param: The offset of the chunk of bytes to upload for the upload session
   */
  'X-Upload-Offset'?: number;
}

export declare namespace Uploads {
  export {
    type UploadCreateResponse as UploadCreateResponse,
    type UploadGetResponse as UploadGetResponse,
    type UploadPartResponse as UploadPartResponse,
    type UploadCreateParams as UploadCreateParams,
    type UploadGetParams as UploadGetParams,
    type UploadPartParams as UploadPartParams,
  };
}
