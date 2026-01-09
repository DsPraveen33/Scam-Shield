import { z } from 'zod';
import { insertBlacklistSchema, insertKeywordSchema, scans, blacklist, keywords } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  scans: {
    create: {
      method: 'POST' as const,
      path: '/api/scans',
      input: z.object({
        jobUrl: z.string().optional(),
        offerText: z.string().optional(),
      }).refine(data => data.jobUrl || data.offerText, {
        message: "Either jobUrl or offerText must be provided"
      }),
      responses: {
        200: z.custom<typeof scans.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/scans',
      responses: {
        200: z.array(z.custom<typeof scans.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/scans/:id',
      responses: {
        200: z.custom<typeof scans.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  blacklist: {
    list: {
      method: 'GET' as const,
      path: '/api/blacklist',
      responses: {
        200: z.array(z.custom<typeof blacklist.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/blacklist',
      input: insertBlacklistSchema,
      responses: {
        201: z.custom<typeof blacklist.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/blacklist/:id',
      responses: {
        204: z.void(),
      },
    }
  },
  keywords: {
    list: {
      method: 'GET' as const,
      path: '/api/keywords',
      responses: {
        200: z.array(z.custom<typeof keywords.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/keywords',
      input: insertKeywordSchema,
      responses: {
        201: z.custom<typeof keywords.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/keywords/:id',
      responses: {
        204: z.void(),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
