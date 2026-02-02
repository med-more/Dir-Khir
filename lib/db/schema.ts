import { pgTable, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enum pour les catégories
export const categoryEnum = pgEnum('category', [
  'Environnement',
  'Éducation',
  'Social',
  'Alimentation',
  'Santé',
  'Autre'
]);

// Enum pour les niveaux d'urgence
export const urgencyEnum = pgEnum('urgency', ['low', 'medium', 'high']);

// Enum pour le statut
export const statusEnum = pgEnum('status', ['open', 'completed', 'cancelled']);

// Table des utilisateurs (gérée par Better-Auth)
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des sessions (gérée par Better-Auth)
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des comptes (gérée par Better-Auth)
export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des vérifications (gérée par Better-Auth)
export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des besoins (needs)
export const needs = pgTable('need', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: categoryEnum('category').notNull(),
  city: text('city').notNull(),
  whatsapp: text('whatsapp').notNull(),
  urgencyLevel: urgencyEnum('urgencyLevel').notNull().default('medium'),
  status: statusEnum('status').notNull().default('open'),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Table des participations (quand un utilisateur clique sur "Je participe")
export const participations = pgTable('participation', {
  id: text('id').primaryKey(),
  needId: text('needId').notNull().references(() => needs.id, { onDelete: 'cascade' }),
  userId: text('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Types pour TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Need = typeof needs.$inferSelect;
export type NewNeed = typeof needs.$inferInsert;
export type Participation = typeof participations.$inferSelect;
export type NewParticipation = typeof participations.$inferInsert;
