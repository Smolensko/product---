CREATE TABLE IF NOT EXISTS "Users" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "password" text NOT NULL,
  "bio" text,
  "avatar" text,
  "role" text NOT NULL DEFAULT 'user',
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
