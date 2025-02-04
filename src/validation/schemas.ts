import { z } from 'zod';

export const signUpSchema = z
  .object({
    login: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(100, { message: 'Password must be less than 100 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Password must contain at least one special character',
      }),
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: 'Passwords do not match',
    path: ['checkPassword'],
  });
export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  login: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .max(100, { message: 'Password must be less than 100 characters long' }),
  // .regex(/[A-Z]/, {
  //   message: 'Password must contain at least one uppercase letter',
  // })
  // .regex(/[a-z]/, {
  //   message: 'Password must contain at least one lowercase letter',
  // })
  // .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  // .regex(/[^a-zA-Z0-9]/, {
  //   message: 'Password must contain at least one special character',
  // }),
});
export type SignInSchemaType = z.infer<typeof signInSchema>;

export const createBoardSchema = z.object({
  title: z.string().min(4, { message: 'Title should contain 4 or more symbols' }),
});
export type CreateBoardSchemaType = z.infer<typeof createBoardSchema>;

export const updateSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, { message: 'Title is required and cannot be empty or whitespace. Minimum length - 4s.' }),
});
export type UpdateSectionSchemaType = z.infer<typeof updateSectionSchema>;

export const updateBoardSchema = z.object({
  title: z
    .string()
    .trim()
    .optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});
export type UpdateBoardSchemaType = z.infer<typeof updateBoardSchema>;

export const taskUpdateSchema = z.object({
  title: z.string().min(4, { message: 'Task title should be more than 4 s.' }).optional(),
  content: z.string().optional(),
  deadline: z.date().optional().nullable(),
});

export type TaskUpdateSchemaType = z.infer<typeof taskUpdateSchema>;
