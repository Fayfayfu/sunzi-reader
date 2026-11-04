import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const readers = sqliteTable('readers', {
  userId: text('user_id').primaryKey(),
  readMask: integer('read_mask').notNull().default(0),
  chapter: integer('chapter'),
  part: integer('part').notNull().default(0)
});
