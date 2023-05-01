import { z } from 'zod';
import { baseProcedure, router } from '../trpc';

export const todoRouter = router({
  all: baseProcedure.query(({ ctx }) => {
    return [
      {id: '1', text: 'test', completed: false},
      {id: '2', text: 'test2', completed: true},
    ];
  }),
  add: baseProcedure
    .input(
      z.object({
        id: z.string().optional(),
        text: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return [];
    }),
  edit: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.object({
          completed: z.boolean().optional(),
          text: z.string().min(1).optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      return {};
    }),
});
