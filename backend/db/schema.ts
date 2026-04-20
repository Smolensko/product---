import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = sqliteTable('Users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  bio: text('bio'),
  avatar: text('avatar'),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at').default(new Date().toISOString()).notNull(),
  updatedAt: text('updated_at').default(new Date().toISOString()).notNull(),
});

export const events = sqliteTable('Events', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  year: text('year').notNull(),
  location: text('location'),
  dynasty: text('dynasty'),
  figures: text('figures'),
  description: text('description').notNull(),
  category: text('category').notNull(),
  image: text('image'),
  createdAt: text('created_at').default(new Date().toISOString()).notNull(),
});

export const persons = sqliteTable('Persons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  alias: text('alias'),
  birthYear: text('birth_year'),
  deathYear: text('death_year'),
  dynasty: text('dynasty'),
  role: text('role'),
  description: text('description').notNull(),
  image: text('image'),
  createdAt: text('created_at').default(new Date().toISOString()).notNull(),
});

export const dynasties = sqliteTable('Dynasties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  period: text('period').notNull(),
  capital: text('capital'),
  achievements: text('achievements'),
  description: text('description').notNull(),
  createdAt: text('created_at').default(new Date().toISOString()).notNull(),
});

export const insertUserSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(100),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少8位'),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  role: z.string().optional(),
});

export const updateUserSchema = insertUserSchema.partial().omit({ password: true });

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;
export type Person = typeof persons.$inferSelect;
export type InsertPerson = typeof persons.$inferInsert;
export type Dynasty = typeof dynasties.$inferSelect;
export type InsertDynasty = typeof dynasties.$inferInsert;
