import { z } from 'zod'

// Auth Schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Post Schemas
export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
})

export const updatePostSchema = createPostSchema.partial()

// Comment Schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(10000, 'Comment too long'),
  postId: z.string(),
  parentId: z.string().optional(),
})

// Vote Schema
export const voteSchema = z.object({
  value: z.number().int().min(-1).max(1),
  postId: z.string().optional(),
  commentId: z.string().optional(),
}).refine((data) => !!(data.postId || data.commentId), {
  message: 'Either postId or commentId must be provided',
})

// Report Schema
export const reportSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  postId: z.string(),
})

// User Update Schema
export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  image: z.string().url('Invalid image URL').optional(),
})

// Search Schema
export const searchSchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  sort: z.enum(['hot', 'new', 'top']).optional(),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type VoteInput = z.infer<typeof voteSchema>
export type ReportInput = z.infer<typeof reportSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type SearchInput = z.infer<typeof searchSchema>
