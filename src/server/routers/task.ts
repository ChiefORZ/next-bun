/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createRouter } from '../createRouter';
import { prisma } from '../prisma';

/**
 * Default selector for Task.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 *
 * @see https://github.com/prisma/prisma/issues/9353
 */
const defaultTaskSelect = Prisma.validator<Prisma.TaskSelect>()({
  id: true,
  name: true,
  done: true,
  createdAt: true,
  updatedAt: true,
});

export const taskRouter = createRouter()
  // create
  .mutation('add', {
    input: z.object({
      name: z.string().min(1),
    }),
    async resolve({ input }) {
      const task = await prisma.task.create({
        data: { done: false, ...input },
        select: defaultTaskSelect,
      });
      return task;
    },
  })
  // read
  .query('all', {
    async resolve() {
      /**
       * For pagination you can have a look at this docs site
       *
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return prisma.task.findMany({
        select: defaultTaskSelect,
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input;
      const task = await prisma.task.findUnique({
        where: { id },
        select: defaultTaskSelect,
      });
      if (!task) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No task with id '${id}'`,
        });
      }
      return task;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.number(),
      data: z.object({
        name: z.string().min(1).optional(),
        done: z.boolean().optional(),
      }),
    }),
    async resolve({ input }) {
      const { id, data } = input;
      const task = await prisma.task.update({
        where: { id },
        data,
        select: defaultTaskSelect,
      });
      return task;
    },
  })
  // delete
  .mutation('delete', {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ input }) {
      const { id } = input;
      await prisma.task.delete({ where: { id } });
      return {
        id,
      };
    },
  });
