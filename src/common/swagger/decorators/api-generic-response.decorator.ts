import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse as SwaggerApiResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiError } from '../../models/api-error.model';
import { ApiResponse } from '../../models/api-response.model';
import { PageResult } from '../../models/page-result.model';

export const ApiGenericResponse = <TModel extends Type<any>>(
  model?: TModel,
  options?: { isArray?: boolean; isPaginated?: boolean; status?: number },
) => {
  let dataProp: Record<string, any>;

  if (!model) {
    dataProp = { type: 'object', nullable: true, example: null };
  } else if (options?.isPaginated) {
    dataProp = {
      allOf: [
        { $ref: getSchemaPath(PageResult) },
        {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(model) },
            },
          },
        },
      ],
    };
  } else if (options?.isArray) {
    dataProp = {
      type: 'array',
      items: { $ref: getSchemaPath(model) },
    };
  } else {
    dataProp = {
      $ref: getSchemaPath(model),
    };
  }

  const modelsToExtract: Type<any>[] = [ApiResponse, PageResult, ApiError];
  if (model) {
    modelsToExtract.push(model);
  }

  const decorators = [
    ApiExtraModels(...modelsToExtract),
    SwaggerApiResponse({
      status: options?.status || 200,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            type: 'object',
            properties: {
              data: dataProp,
            },
          },
        ],
      },
    }),
    ApiBadRequestResponse({ description: 'Bad Request', type: ApiError }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: ApiError }),
    ApiForbiddenResponse({ description: 'Forbidden', type: ApiError }),
    ApiNotFoundResponse({ description: 'Not Found', type: ApiError }),
    ApiConflictResponse({ description: 'Conflict', type: ApiError }),
    ApiUnprocessableEntityResponse({
      description: 'Unprocessable Entity',
      type: ApiError,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: ApiError,
    }),
  ];

  return applyDecorators(...decorators);
};
