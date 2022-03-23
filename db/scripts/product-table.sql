CREATE TABLE product (
    id UUID not null default gen_random_uuid() PRIMARY KEY,
    "name" varchar not null,
    price float not null
    
)