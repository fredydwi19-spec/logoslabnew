import { mysqlTable, serial, varchar, text, mysqlEnum, int, json, timestamp } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['ketua_tim', 'pembuat_materi', 'pembuat_game', 'pakar', 'siswa']).notNull(),
  status: mysqlEnum('status', ['pending', 'active', 'inactive']).default('pending').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = mysqlTable('courses', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: mysqlEnum('status', ['draft', 'revision_needed', 'review', 'approved', 'published']).default('draft').notNull(),
  contentAuthorId: int('content_author_id').references(() => users.id),
  gameCreatorId: int('game_creator_id').references(() => users.id),
  expertReviewerId: int('expert_reviewer_id').references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contents = mysqlTable('contents', {
  id: int('id').autoincrement().primaryKey(),
  courseId: int('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  indicatorTag: mysqlEnum('indicator_tag', ['kognitif', 'metodologis', 'kontekstual']).notNull(),
});

export const games = mysqlTable('games', {
  id: int('id').autoincrement().primaryKey(),
  courseId: int('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  gameType: mysqlEnum('game_type', ['pilihan_ganda', 'puzzle', 'pasang_kata']).notNull(),
  configData: json('config_data').notNull(),
});

export const reviews = mysqlTable('reviews', {
  id: int('id').autoincrement().primaryKey(),
  courseId: int('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  reviewerId: int('reviewer_id').notNull().references(() => users.id),
  comment: text('comment').notNull(),
  statusRecommendation: mysqlEnum('status_recommendation', ['revision_needed', 'approved']).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const studentProfiles = mysqlTable('student_profiles', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cognitiveScore: int('cognitive_score').default(0).notNull(),
  methodologicalScore: int('methodological_score').default(0).notNull(),
  contextualScore: int('contextual_score').default(0).notNull(),
  currentLevel: mysqlEnum('current_level', ['dasar', 'menengah', 'mahir']).default('dasar').notNull(),
});

// Definisi Relasi untuk Query mempermudah Join
export const usersRelations = relations(users, ({ many }) => ({
  coursesAuthored: many(courses, { relationName: 'contentAuthor' }),
  coursesGamed: many(courses, { relationName: 'gameCreator' }),
  coursesReviewed: many(courses, { relationName: 'expertReviewer' }),
  reviews: many(reviews),
  profile: many(studentProfiles),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  contentAuthor: one(users, {
    fields: [courses.contentAuthorId],
    references: [users.id],
    relationName: 'contentAuthor'
  }),
  gameCreator: one(users, {
    fields: [courses.gameCreatorId],
    references: [users.id],
    relationName: 'gameCreator'
  }),
  expertReviewer: one(users, {
    fields: [courses.expertReviewerId],
    references: [users.id],
    relationName: 'expertReviewer'
  }),
  contents: many(contents),
  games: many(games),
  reviews: many(reviews),
}));

export const contentsRelations = relations(contents, ({ one }) => ({
  course: one(courses, {
    fields: [contents.courseId],
    references: [courses.id],
  }),
}));

export const gamesRelations = relations(games, ({ one }) => ({
  course: one(courses, {
    fields: [games.courseId],
    references: [courses.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  course: one(courses, {
    fields: [reviews.courseId],
    references: [courses.id],
  }),
  reviewer: one(users, {
    fields: [reviews.reviewerId],
    references: [users.id],
  }),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  user: one(users, {
    fields: [studentProfiles.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type NewStudentProfile = typeof studentProfiles.$inferInsert;
