CREATE TABLE `readers` (
	`user_id` text PRIMARY KEY NOT NULL,
	`read_mask` integer DEFAULT 0 NOT NULL,
	`chapter` integer,
	`part` integer DEFAULT 0 NOT NULL
);
