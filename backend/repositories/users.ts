import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import type { InsertUser } from '../db/schema';

export const usersRepository = {
  async findByEmail(email: string) {
    return db.query.users.findFirst({ where: eq(users.email, email) });
  },

  async findById(id: number) {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  },

  async create(userData: InsertUser) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },

  async update(id: number, userData: Partial<InsertUser>) {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async findAll() {
    return db.select().from(users);
  },
};
