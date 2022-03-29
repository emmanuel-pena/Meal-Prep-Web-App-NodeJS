

DROP TABLE IF EXISTS grocerys_recipe CASCADE;
DROP TABLE IF EXISTS grocery_list CASCADE;
DROP TABLE IF EXISTS favorite_recipes CASCADE;
DROP TABLE IF EXISTS recipe CASCADE;
DROP TABLE IF EXISTS member CASCADE;
DROP TYPE IF EXISTS accountType;
DROP TYPE IF EXISTS calendarRecipes;

CREATE TYPE accountType AS ENUM ('native', 'google');
CREATE TABLE member ( 
      id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), 
      email VARCHAR (60) UNIQUE NOT NULL, 
      username VARCHAR (60) UNIQUE, 
      password_hash TEXT, 
      is_activated BOOLEAN NOT NULL DEFAULT false,
      account_type accountType DEFAULT 'native'
);

--use spoonacular's recipe's id as the id for this table
CREATE TABLE recipe (
      id INTEGER UNIQUE PRIMARY KEY,
      info jsonb NOT NULL
);

CREATE TABLE favorite_recipes (
      id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
      member_id UUID NOT NULL,
      recipe_id INTEGER NOT NULL,
      FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
      FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE   
);

CREATE TABLE grocery_list (
      id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
      list_name VARCHAR (60) UNIQUE,
      created_at DATE,
      member_id UUID NOT NULL,
      FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
);

CREATE TABLE grocerys_recipe (
      id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
      quantity INTEGER NOT NULL DEFAULT 1,
      grocery_list_id UUID NOT NULL,
      recipe_id INTEGER NOT NULL,
      FOREIGN KEY (grocery_list_id) REFERENCES grocery_list(id) ON DELETE CASCADE,
      FOREIGN KEY (recipe_id) REFERENCES recipe(id) ON DELETE CASCADE 
);

CREATE TABLE calendarRecipes (
      memberId UUID NOT NULL,
      meal  VARCHAR(60),
      title  VARCHAR(60),
      recipeId INTEGER,
      planned VARCHAR(15),
      PRIMARY KEY(memberId, meal, title, recipeId, planned)
);
