import { z } from 'zod';
import type { Prisma } from '../../../lib/generated/prisma';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','name','email','emailVerified','password','image','createdAt','updatedAt']);

export const AccountScalarFieldEnumSchema = z.enum(['userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','token_type','scope','id_token','session_state','createdAt','updatedAt']);

export const SessionScalarFieldEnumSchema = z.enum(['sessionToken','userId','expires','createdAt','updatedAt']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const LessonScalarFieldEnumSchema = z.enum(['id','title','description','order','createdAt','updatedAt']);

export const ProblemScalarFieldEnumSchema = z.enum(['id','lessonId','type','question','answer','order','createdAt','updatedAt']);

export const ProblemOptionScalarFieldEnumSchema = z.enum(['id','problemId','text','order','createdAt','updatedAt']);

export const UserLessonProgressScalarFieldEnumSchema = z.enum(['id','userId','lessonId','completed','percentage','createdAt','updatedAt']);

export const UserProblemAttemptScalarFieldEnumSchema = z.enum(['id','userId','problemId','attemptId','answer','isCorrect','xpEarned','createdAt','updatedAt']);

export const UserStreakScalarFieldEnumSchema = z.enum(['id','userId','currentStreak','longestStreak','lastActive','createdAt','updatedAt']);

export const UserXPScalarFieldEnumSchema = z.enum(['id','userId','amount','sourceType','sourceId','description','category','createdAt','updatedAt']);

export const UserProfileScalarFieldEnumSchema = z.enum(['id','userId','totalXP','progress','createdAt','updatedAt']);

export const TemporaryAnswerScalarFieldEnumSchema = z.enum(['id','userId','problemId','lessonId','answer','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const ProblemTypeSchema = z.enum(['MULTIPLE_CHOICE','INPUT']);

export type ProblemTypeType = `${z.infer<typeof ProblemTypeSchema>}`

export const XPSourceTypeSchema = z.enum(['USER_PROBLEM_ATTEMPT','MANUAL_ADJUSTMENT','SPECIAL_ACHIEVEMENT','DAILY_STREAK']);

export type XPSourceTypeType = `${z.infer<typeof XPSourceTypeSchema>}`

export const XPCategorySchema = z.enum(['CORRECT_ANSWER','STREAK_BONUS','ACHIEVEMENT','MANUAL']);

export type XPCategoryType = `${z.infer<typeof XPCategorySchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  username: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.coerce.date().nullable(),
  password: z.string(),
  image: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// LESSON SCHEMA
/////////////////////////////////////////

export const LessonSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  order: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Lesson = z.infer<typeof LessonSchema>

/////////////////////////////////////////
// PROBLEM SCHEMA
/////////////////////////////////////////

export const ProblemSchema = z.object({
  type: ProblemTypeSchema,
  id: z.string().cuid(),
  lessonId: z.string(),
  question: z.string(),
  answer: z.string(),
  order: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Problem = z.infer<typeof ProblemSchema>

/////////////////////////////////////////
// PROBLEM OPTION SCHEMA
/////////////////////////////////////////

export const ProblemOptionSchema = z.object({
  id: z.string().cuid(),
  problemId: z.string(),
  text: z.string(),
  order: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type ProblemOption = z.infer<typeof ProblemOptionSchema>

/////////////////////////////////////////
// USER LESSON PROGRESS SCHEMA
/////////////////////////////////////////

export const UserLessonProgressSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  lessonId: z.string(),
  completed: z.boolean(),
  percentage: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserLessonProgress = z.infer<typeof UserLessonProgressSchema>

/////////////////////////////////////////
// USER PROBLEM ATTEMPT SCHEMA
/////////////////////////////////////////

export const UserProblemAttemptSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  problemId: z.string(),
  attemptId: z.string(),
  answer: z.string(),
  isCorrect: z.boolean(),
  xpEarned: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserProblemAttempt = z.infer<typeof UserProblemAttemptSchema>

/////////////////////////////////////////
// USER STREAK SCHEMA
/////////////////////////////////////////

export const UserStreakSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  currentStreak: z.number().int(),
  longestStreak: z.number().int(),
  lastActive: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserStreak = z.infer<typeof UserStreakSchema>

/////////////////////////////////////////
// USER XP SCHEMA
/////////////////////////////////////////

export const UserXPSchema = z.object({
  sourceType: XPSourceTypeSchema,
  category: XPCategorySchema,
  id: z.string().cuid(),
  userId: z.string(),
  amount: z.number().int(),
  sourceId: z.string(),
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserXP = z.infer<typeof UserXPSchema>

/////////////////////////////////////////
// USER PROFILE SCHEMA
/////////////////////////////////////////

export const UserProfileSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  totalXP: z.number().int(),
  progress: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserProfile = z.infer<typeof UserProfileSchema>

/////////////////////////////////////////
// TEMPORARY ANSWER SCHEMA
/////////////////////////////////////////

export const TemporaryAnswerSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  problemId: z.string(),
  lessonId: z.string(),
  answer: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type TemporaryAnswer = z.infer<typeof TemporaryAnswerSchema>
