--create extension if not exists "uuid-ossp"


create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)


insert into products (title, description, price) values
('UNO', 'UNO is the classic family card game thats easy to learn and so much fun to play!', 9.99),
('Exploding Kittens', 'A Russian Roulette Card Game, Easy Family-Friendly Party Games', 15.99),
('Lets Get Deep', 'The Relationship Game Full of Questions for Couples', 23),
('Cards Against Humanity', 'Cards Against Humanity is a party game for horrible people"', 25 ),
('Guess in 10', 'Card Game of Smart Questions', 23),
('Taco Cat Goat Cheese Pizza', 'PLAY IT ANY TIME ANY PLACE- Convenient take anywhere size game', 15),
('Taco vs Burrito', 'The Wildly Popular Surprisingly Strategic Card', 23),
('Kids Against Maturity', 'Card Game for Kids and Families, Super Fun Hilarious for Family Party', 15)



create table if not exists stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
)

insert into stocks (product_id, count) values
('ba497859-7679-473c-ae62-6dbb935e1c14', 4),
('f890d129-9ca8-4f31-8f29-9281059680eb', 6),
('1d95726e-2f93-41de-b2ab-09f7c65232c3', 7),
('ce9f3099-4e61-4d73-a4e5-0ff4c0142474', 12),
('a9acdc5c-b303-4263-bf1e-e81f188db238', 8),
('f220a2d2-632d-4e15-a10d-3544f8aeb8c0', 2),
('73f63f43-abd8-4f2e-a965-e919daaec0e5', 1),
('b428773f-d942-4d6f-a645-ac473c227ea7', 5)
