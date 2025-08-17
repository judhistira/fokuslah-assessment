# XP Tracking System

## Overview
The XP tracking system provides detailed auditing and rollback capabilities for user experience points. Each XP transaction is stored as a separate record, allowing for complete traceability of how users earn XP.

## Features
- **Audit Trail**: Every XP transaction is recorded with source information
- **Rollback Support**: Transactions can be deleted with cascade deletion
- **Real-time Calculation**: User total XP is calculated by aggregating all transactions
- **Categorization**: XP transactions are categorized for analytics

## Database Schema

### UserXP Model
```prisma
model UserXP {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amount      Int
  sourceType  XPSourceType
  sourceId    String
  description String
  category    XPCategory
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Enums
```prisma
enum XPSourceType {
  USER_PROBLEM_ATTEMPT
  MANUAL_ADJUSTMENT
  SPECIAL_ACHIEVEMENT
  DAILY_STREAK
}

enum XPCategory {
  CORRECT_ANSWER
  STREAK_BONUS
  ACHIEVEMENT
  MANUAL
}
```

## How It Works

1. **XP Awarding**: When a user completes an action that earns XP, a new `UserXP` record is created
2. **Profile Update**: The user's `UserProfile.totalXP` is recalculated by summing all related `UserXP` records
3. **Cascade Deletion**: When a source entity (like a problem attempt) is deleted, related XP transactions are automatically removed
4. **Audit**: All XP changes are logged with timestamps and descriptions

## API Usage

### Awarding XP
```typescript
import { awardXP } from "@/lib/xp-manager";

await awardXP({
  userId: "user123",
  amount: 10,
  sourceType: "USER_PROBLEM_ATTEMPT",
  sourceId: "attempt456",
  description: "Correct answer for problem 789",
  category: "CORRECT_ANSWER"
});
```

### Recalculating Total XP
```typescript
import { recalculateUserXP } from "@/lib/xp-manager";

const totalXP = await recalculateUserXP("user123");
```

## Migration Process

When upgrading from the old system:
1. Run the migration script to convert existing XP data to transactions
2. Update the UserProfile.totalXP field for each user
3. Test the new system with sample data

## Benefits
- **Traceability**: Know exactly how and when users earned XP
- **Reversibility**: Remove XP transactions if needed
- **Analytics**: Categorize XP for reporting and insights
- **Scalability**: Efficient querying and indexing