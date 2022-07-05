/* eslint-disable max-len */
const { Pool } = require('pg');

const pool = new Pool({
  host: 'ec2-34-194-73-236.compute-1.amazonaws.com',
  port: 5432,
  database: 'd19le3rr37lphv',
  user: 'pjxfiistpvaczx',
  password: 'ea2e812dce206e6e34595ed8e62a14025b33b71e10c1a54ecc1c655c35ef875d',
});

exports.userExists = async (userInfo) => {
  let select = 'SELECT * FROM member';
  const queryValues = [];

  if (userInfo.username && userInfo.email) {
    select += ' WHERE email = $1 OR username = $2';
    queryValues.push(userInfo.email, userInfo.username);
  } else if (userInfo.email) {
    select += ' WHERE email = $1 ';
    queryValues.push(userInfo.email);
  } else {
    select += ' WHERE username = $1 ';
    queryValues.push(userInfo.username);
  }

  const query = {
    text: select,
    values: queryValues,
  };

  const { rows } = await pool.query(query);
  return rows.length == 0 ? false : rows;
};

exports.addUser = async (newUser) => {
  const insert =
    'INSERT INTO member(email, username, password_hash, is_activated)' +
    'VALUES ($1, $2, $3, $4) RETURNING id, username, email';

  const query = {
    text: insert,
    values: [
      newUser.email,
      newUser.username,
      newUser.password,
      newUser.isActivated,
    ],
  };
  const { rows } = await pool.query(query);
  return rows;
};

exports.selectUserById = async (id) => {
  const select = 'SELECT * FROM member WHERE id = $1';
  const query = {
    text: select,
    values: [id],
  };

  const { rows } = await pool.query(query);
  return rows.length == 1 ? rows[0] : undefined;
};

exports.getUserId = async (email) => {
  const select = 'SELECT id FROM member WHERE email = $1';
  const query = {
    text: select,
    values: [email],
  };

  const { rows } = await pool.query(query);
  return rows.length == 1 ? rows[0].id : undefined;
};

exports.updateUserActivation = async (id) => {
  const update = 'UPDATE member SET is_activated = $1' +
    ' WHERE id = $2 RETURNING *';

  const query = {
    text: update,
    values: [true, id],
  };

  const { rows } = await pool.query(query);
  return rows.length == 1 ? rows[0] : undefined;
};

exports.updatePassword = async (id, newPassword) => {
  const update = 'UPDATE member SET password_hash = $1' +
    ' WHERE id = $2 RETURNING *';

  const query = {
    text: update,
    values: [newPassword, id],
  };
  const { rows } = await pool.query(query);
  return rows.length == 1 ? rows[0] : undefined;
};

insertGoogleUserToDb = async (email) => {
  console.log('inside insert db');

  const isActivated = 'true';
  const accType = 'google';

  const select = 'INSERT INTO member(email, is_activated, account_type) VALUES ($1, $2, $3)';
  const query = {
    text: select,
    values: [email, isActivated, accType],
  };

  await pool.query(query);
  return;
};

exports.upsertGoogleUser = async (email) => {
  console.log('inside upsert db');
  const select = 'SELECT * FROM member WHERE email = $1';
  const query = {
    text: select,
    values: [email],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    // user already in our database
    console.log('Google user already existed\n');
    return;
  } else {
    console.log('Saving google user to db');
    await insertGoogleUserToDb(email);
    return;
  }
};

insertIntoRecipes = async (recipeId, recipee) => {
  const recipe = JSON.stringify(recipee);

  console.log('logging recipe stringified version that will go in db:\n');
  console.log(recipe);
  console.log('logging recipe object version:\n');
  console.log(recipee);

  const select = 'INSERT INTO recipe (id, info) VALUES ($1, $2) ON CONFLICT DO NOTHING';
  const query = {
    text: select,
    values: [recipeId, recipe],
  };

  await pool.query(query);
};

searchExistingFavorites = async (memberId, recipeId) => {
  const select = 'SELECT * FROM favorite_recipes WHERE member_id = $1 AND recipe_id = $2';
  const query = {
    text: select,
    values: [memberId, recipeId],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    return 1;
  } else {
    return 0;
  }
};

exports.addToFavorites = async (info, userId) => {
  const memberId = userId;
  const recipeId = info.recipeId;
  const recipe = info.RecipeObj;

  console.log(memberId);
  console.log(recipeId);
  console.log(recipe);

  const exists = await searchExistingFavorites(memberId, recipeId);

  if (exists === 1) {
    console.log('Already an existing favorites table entry for fields:\n');
    const foundObj = {};
    foundObj.memberId = memberId;
    foundObj.recipeId = recipeId;
    return 'exist';
  } else {
    await insertIntoRecipes(recipeId, recipe);

    const select = 'INSERT INTO favorite_recipes (member_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *';
    const query = {
      text: select,
      values: [memberId, recipeId],
    };


    const { rows } = await pool.query(query);
    console.log(rows);
    console.log(rows.length);

    if (rows.length > 0) {
      const returnedObj = {};
      console.log('in final returns of addToFavorites');
      console.log(rows.length);
      returnedObj.memberId = memberId;
      returnedObj.recipeId = recipeId;

      console.log(returnedObj);

      return returnedObj;
    } else {
      return null;
    }
  }
};


exports.addGroceryList = async (info, userId) => {
  const listName = info.listName;

  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const date = todayUTC.toISOString().slice(0, 10);

  const memberId = userId;

  const select = 'INSERT INTO grocery_list (list_name, created_at, member_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id';
  const query = {
    text: select,
    values: [listName, date, memberId],
  };


  const { rows } = await pool.query(query);
  console.log(rows);
  console.log(rows.length);

  if (rows.length > 0) {
    const returnedObj = {};
    console.log('in final returns of addGroceryList');
    console.log(rows.length);
    returnedObj.listName = listName;
    returnedObj.date = date;
    returnedObj.memberId = memberId;
    returnedObj.listId = rows[0].id;

    console.log(returnedObj);

    return returnedObj;
  } else {
    return null;
  }
};

searchGrocerysRecipes = async (groceryListId, recipeId, memberId) => {
  const select = 'SELECT gr.* FROM grocerys_recipe gr, grocery_list gl WHERE gr.grocery_list_id = $1 AND gr.recipe_id = $2 AND gl.member_id = $3 AND gr.grocery_list_id = gl.id';
  const query = {
    text: select,
    values: [groceryListId, recipeId, memberId],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    return 1;
  } else {
    return 0;
  }
};

incrementGrocerysRecipeCount = async (groceryListId, recipeId) => {
  const select = 'UPDATE grocerys_recipe SET quantity = quantity + 1 WHERE grocery_list_id = $1 AND recipe_id = $2';
  const query = {
    text: select,
    values: [groceryListId, recipeId],
  };

  await pool.query(query);
};

exports.addToNewGroceryList = async (info, userId) => {
  const groceryListId = info.groceryListId;
  const recipeId = info.recipeId;
  const memberId = userId;
  const recipe = info.RecipeObj;

  const found = await searchGrocerysRecipes(groceryListId, recipeId, memberId); // see if this would be a duplicate in grocerys_recipe table

  if (found === 1) {
    // increment count && return something not null;
    await incrementGrocerysRecipeCount(groceryListId, recipeId);

    returnedObj.groceryListId = groceryListId;
    returnedObj.recipeId = recipeId;
    console.log('duplicate, so just updated count for inputs:\n');
    console.log(returnedObj);

    return returnedObj;
  } else {
    await insertIntoRecipes(recipeId, recipe);

    const select = 'INSERT INTO grocerys_recipe (grocery_list_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING grocery_list_id';
    const query = {
      text: select,
      values: [groceryListId, recipeId],
    };


    const { rows } = await pool.query(query);
    console.log(rows);
    console.log(rows.length);

    if (rows.length > 0) {
      const returnedObj = {};
      console.log('in final returns of addToNewGroceryList');
      console.log(rows.length);
      returnedObj.groceryListId = groceryListId;
      returnedObj.recipeId = recipeId;

      console.log(returnedObj);

      return returnedObj;
    } else {
      return null;
    }
  }
};

getGroceryListId = async (listNamee, memberIdd) => {
  const listName = listNamee;
  const memberId = memberIdd;

  const select = 'SELECT DISTINCT id FROM grocery_list WHERE list_name = $1 AND member_id = $2';
  const query = {
    text: select,
    values: [listName, memberId],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    return rows[0].id;
  } else {
    return null;
  }
};

exports.addToExistingGroceryList = async (info, userId) => {
  const listName = info.listName;
  const recipeId = info.recipeId;
  const memberId = userId;
  const recipe = info.RecipeObj;

  const groceryListId = await getGroceryListId(listName, memberId);

  const found = await searchGrocerysRecipes(groceryListId, recipeId, memberId); // see if this would be a duplicate in grocerys_recipe table

  if (found === 1) {
    // increment count && return something not null;
    await incrementGrocerysRecipeCount(groceryListId, recipeId);

    returnedObj.groceryListId = groceryListId;
    returnedObj.recipeId = recipeId;
    console.log('duplicate, so just updated count for inputs:\n');
    console.log(returnedObj);

    return returnedObj;
  } else {
    await insertIntoRecipes(recipeId, recipe);

    const select = 'INSERT INTO grocerys_recipe (grocery_list_id, recipe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING grocery_list_id';
    const query = {
      text: select,
      values: [groceryListId, recipeId],
    };


    const { rows } = await pool.query(query);
    console.log(rows);
    console.log(rows.length);

    if (rows.length > 0) {
      const returnedObj = {};
      console.log('in final returns of AddToExistingGroceryList');
      console.log(rows.length);
      returnedObj.groceryListId = groceryListId;
      returnedObj.recipeId = recipeId;

      console.log(returnedObj);

      return returnedObj;
    } else {
      return null;
    }
  }
};


exports.getAllFromFavorites = async (memberIdd) => {
  const memberId = memberIdd;

  const select = 'SELECT DISTINCT r.info FROM recipe r, favorite_recipes f WHERE r.id = f.recipe_id AND f.member_id = $1';
  const query = {
    text: select,
    values: [memberId],
  };

  const results = []; // will return all favorite recipe objects from this user's array

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      results.push(rows[i].info);
    }
    return results;
  } else {
    return [];
  }
};

exports.getGroceryLists = async (memberIdd) => {
  const memberId = memberIdd;

  const select = 'SELECT list_name, id, created_at FROM grocery_list WHERE member_id = $1';
  const query = {
    text: select,
    values: [memberId],
  };

  const results = []; // will return all favorite recipe objects from this user's array

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      const item = {};

      item.list_name = rows[i].list_name;
      item.listId = rows[i].id;
      item.created_at = rows[i].created_at;

      results.push(item);
    }
    return results;
  } else {
    return [];
  }
};

exports.getAllFromGroceryList = async (listID) => {
  console.log(listID);
  const select = 'SELECT gr.quantity, gl.member_id, r.id, r.info, gl.list_name FROM grocerys_recipe AS gr INNER JOIN grocery_list AS gl ON gl.id = gr.grocery_list_id INNER JOIN member as m ON m.id = gl.member_id INNER JOIN recipe AS r ON r.id = gr.recipe_id WHERE gr.grocery_list_id = $1 ';
  const query = {
    text: select,
    values: [listID],
  };

  const { rows } = await pool.query(query);

  console.log(rows);
  return rows.length > 0 ? rows : undefined;
};

exports.deleteFromFavorites = async (memberIdd, recipeIdd) => {
  const memberId = memberIdd;
  const recipeId = recipeIdd;

  const select = 'DELETE FROM favorite_recipes WHERE member_id = $1 AND recipe_id = $2 RETURNING *';
  const query = {
    text: select,
    values: [memberId, recipeId],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    return rows.length;
  } else {
    return null;
  }
};

exports.deleteGroceryList = async (listNamee, memberIdd) => {
  const listName = listNamee;
  const memberId = memberIdd;

  const select = 'DELETE FROM grocery_list WHERE list_name = $1 AND member_id = $2 RETURNING *';
  const query = {
    text: select,
    values: [listName, memberId],
  };

  const { rows } = await pool.query(query);
  console.log('db.js line 495)\n');
  console.log(rows);

  if (rows.length > 0) {
    return rows.length;
  } else {
    return null;
  }
};

searchGrocerysRecipeCount = async (groceryListId, recipeId, memberId) => {
  const select = 'SELECT gr.quantity FROM grocerys_recipe gr, grocery_list gl WHERE gr.grocery_list_id = $1 AND gr.recipe_id = $2 AND gl.member_id = $3 AND gr.grocery_list_id = gl.id';
  const query = {
    text: select,
    values: [groceryListId, recipeId, memberId],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    return rows[0].quantity;
  } else {
    return 0;
  }
};

decrementGrocerysRecipeCount = async (groceryListId, recipeId) => {
  const select = 'UPDATE grocerys_recipe SET quantity = quantity - 1 WHERE grocery_list_id = $1 AND recipe_id = $2';
  const query = {
    text: select,
    values: [groceryListId, recipeId],
  };

  await pool.query(query);
};

exports.deleteFromGroceryList = async (memberIdd, groceryListIdd, recipeIdd) => {
  const memberId = memberIdd;
  const groceryListId = groceryListIdd;
  const recipeId = recipeIdd;

  const quantity = await searchGrocerysRecipeCount(groceryListId, recipeId, memberId); // see if this would be a duplicate in grocerys_recipe table

  if (quantity > 1) {
    // increment count && return something not null;
    await decrementGrocerysRecipeCount(groceryListId, recipeId);

    console.log('duplicate, so just decremented count and returning -1:\n');
    return -1;
  } else {
    const select = 'DELETE FROM grocerys_recipe WHERE grocery_list_id = $1 AND recipe_id = $2 RETURNING *';
    const query = {
      text: select,
      values: [groceryListId, recipeId],
    };

    const { rows } = await pool.query(query);

    if (rows.length > 0) {
      return rows.length;
    } else {
      return null;
    }
  }
};

exports.addToMealCalendarTable = async (info, userIdd) => {
  //mm/dd/yyyy to 2022-02-28
  const memberId = userIdd;
  const mealType = info.mealType;
  const recipeId = info.recipeId;
  const recipe = info.RecipeObj;
  const recipeName = info.RecipeObj.title;
  console.log('db.js lines 570');
  console.log(recipeName);
  const date = info.date;
  const plannedDate = date.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");

  await insertIntoRecipes(recipeId, recipe);

  const select = 'INSERT INTO calendarRecipes(memberId, meal, title, recipeId, planned) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING title';

  const query = {
    text: select,
    values: [memberId, mealType, recipeName, recipeId, plannedDate],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    const returnedObj = {};
    returnedObj.recipeId = recipeId;
    returnedObj.memberId = memberId;

    return returnedObj;
  } else {
    return null;
  }
};

exports.getAllFromMealCalendarTable = async (userIdd) => {
  const memberId = userIdd;

  const select = 'SELECT DISTINCT r.info, mr.meal, mr.title, mr.planned FROM calendarRecipes mr, recipe r WHERE mr.recipeId = r.id AND mr.memberID = $1';

  const query = {
    text: select,
    values: [memberId],
  };


  const { rows } = await pool.query(query);
  console.log('db.js rows)');
  console.log(rows);
  let array = [];
  let item = { meal: '', title: '', planned: '', recipe: '' };

  for (let i = 0; i < rows.length; i++) {
    item.meal = rows[i].meal;
    item.title = rows[i].title;
    item.planned = rows[i].planned;
    item.recipe = rows[i].info;

    const copy = { meal: item.meal, title: item.title, planned: item.planned, recipe: item.recipe };
    array.push(copy);
  }

  console.log('db.js array)');
  console.log(array);

  console.log('db.js rows.length)');
  console.log(rows.length);

  if (rows.length > 0) {
    return array;
  } else {
    return [];
  }
};


exports.deleteFromMealCalendarTable = async (datee, mealIdd, userIdd, mealTypee) => {

  const select = '';

  const query = {
    text: select,
    values: [date, mealId, memberId],
  };

  const { rows } = await pool.query(query);

  if (rows.length > 0) {
    return rows.length;
  } else {
    return null;
  }
};


exports.getRecipesAndListNames = async (userIdd) => {

  const select = 'SELECT r.info, gr.quantity, gl.list_name, gl.created_at FROM recipe r, grocery_list gl, grocerys_recipe gr WHERE r.id = gr.recipe_id AND gl.id = gr.grocery_list_id AND gl.member_id = $1';
  console.log('db.js:\n:');
  console.log(userIdd);
  const query = {
    text: select,
    values: [userIdd],
  };

  const { rows } = await pool.query(query);
  console.log('db.js:\n:');
  console.log(rows);
  let returnedArray = [];
  let infoObj = { recipe: '', quantity: 0, listName: '', createdAt: '' };

  for (let i = 0; i < parseInt(rows.length); i++) {
    infoObj["recipe"] = rows[i].info;
    infoObj.quantity = rows[i].quantity;
    infoObj["listName"] = rows[i].list_name;
    infoObj.createdAt = rows[i].created_at;

    const copy = { recipe: infoObj.recipe, quantity: infoObj.quantity, listName: infoObj.listName, createdAt: infoObj.createdAt };
    returnedArray.push(copy);
  }
  console.log('db.js:\n:');
  console.log(returnedArray);
  if (rows.length > 0) {
    return returnedArray;
  }
  else {
    return [];
  }
};