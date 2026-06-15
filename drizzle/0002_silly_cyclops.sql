CREATE TABLE `student_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`course_id` int NOT NULL,
	`score_obtained` int DEFAULT 0,
	`is_completed` boolean DEFAULT false,
	CONSTRAINT `student_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `student_progress` ADD CONSTRAINT `student_progress_student_id_users_id_fk` FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `student_progress` ADD CONSTRAINT `student_progress_course_id_courses_id_fk` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;