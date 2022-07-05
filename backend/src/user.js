/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');
require('dotenv').config();
const secret = require('./data/secret.json');
const saltRounds = 11;
const { sendMail, createEmail } = require('./mail');

const createRegistrationToken = (email) => {
  const token = jwt.sign({
    email: email,
  },
    secret.registrationToken, {
    expiresIn: '4h',
    algorithm: 'HS256',
  });
  return token;
};

const createPasswordResetToken = (oldPassword, email) => {
  const token = jwt.sign({
    password: oldPassword,
    email: email,
  },
    secret.resetPasswordToken, {
    expiresIn: '2h',
    algorithm: 'HS256',
  });
  return token;
};

exports.createUser = async (req, res) => {
  const info = req.body;

  if (await db.userExists(info)) {
    res.status(409).send();
  } else {
    const passwordHash = await bcrypt.hash(info.password, saltRounds);
    info.password = passwordHash;
    info.isActivated = false;
    const newUser = await db.addUser(info);
    const registrationToken = createRegistrationToken(newUser[0].email);
    const emailObject = await createEmail(registrationToken, newUser[0].username, true);
    await sendMail(newUser[0].email, emailObject.subject, emailObject.content);
    const response = {
      'email': newUser[0].email,
      'username': newUser[0].username,
      'active': false,
    };
    res.status(201).json(response);
  }
};

exports.authenticateUser = async (req, res) => {
  const info = req.body;
  if ((!info.email && !info.username) || (!info.password)) {
    res.status(400).end();
    return;
  }
  const user = await db.userExists(info);
  if (user) {
    const passwordCorrect = bcrypt.compareSync(
      info.password, user[0].password_hash);
    if (!passwordCorrect) {
      res.status(401).end();
      return;
    } else if (user[0].is_activated === false) {
      res.status(403).end();
      return;
    } else {
      const accessToken = jwt.sign({
        email: user[0].email,
        id: user[0].id,
        username: user[0].username,
      },
        secret.accessToken, {
        expiresIn: '2h',
        algorithm: 'HS256',
      });
      const response = {
        'id': user[0].id,
        'email': user[0].email,
        'username': user[0].username,
        'accessToken': accessToken,
      };
      console.log(`${info.username} has succesfully logged-in!`);
      res.status(200).json(response);
    }
  } else {
    res.status(401).send();
  }
};

exports.emailVerification = async (req, res) => {
  const info = { email: req.email };
  const user = await db.userExists(info);
  if (user[0]['is_activated']) {
    res.status(409).send();
  } else {
    const result = await db.updateUserActivation(user[0].id);
    const response = {
      'email': result.email,
      'username': result.username,
      'isActivated': result.is_activated,
    };
    res.status(200).json(response);
  }
};

exports.resendVerification = async (req, res) => {
  const info = { email: req.body.email };
  const user = await db.userExists(info);
  if (user) {
    const registrationToken = createRegistrationToken(user[0].email);
    const emailObject = await createEmail(registrationToken, user[0].username, true);
    await sendMail(user[0].email, emailObject.subject, emailObject.content);
    res.status(200).json(user[0].email);
  } else {
    res.status(404).send();
  }
};

exports.sendResetPassword = async (req, res) => {
  const info = { email: req.body.email };
  const user = await db.userExists(info);
  if (user) {
    if (user.account_type === 'google') {
      res.status(404).end();
      return;
    }
    const resetPasswordToken = createPasswordResetToken(user[0].password_hash, user[0].email);
    const emailObject = await createEmail(resetPasswordToken, user[0].username, false);
    await sendMail(user[0].email, emailObject.subject, emailObject.content);
    res.status(200).json(user[0].email);
  } else {
    res.status(404).send();
  }
};

exports.resetPassword = async (req, res) => {
  const info = { email: req.email };
  const user = await db.userExists(info);
  if (user) {
    const passwordCorrect = user[0].password_hash === req.oldPassword;
    if (passwordCorrect) {
      const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
      const result = await db.updatePassword(user[0].id, passwordHash);
      res.status(200).json({ email: result.email, username: result.username });
    } else {
      res.status(403).send();
    }
  } else {
    res.status(404).send();
  }
};


exports.addToFavorites = async (req, res) => {
  const info = req.body;
  const userId = req.userID;

  const added = await db.addToFavorites(info, userId);

  if (added === null) {
    res.status(400).send();
  } else if (added === 'exist') {
    res.status(409).send();
  } else {
    res.status(200).send(added);
  }
};

exports.addGroceryList = async (req, res) => {
  const info = req.body;
  const userId = req.userID;

  const added = await db.addGroceryList(info, userId);

  if (added === null) {
    res.status(400).send();
  } else {
    res.status(200).send(added);
  }
};

exports.addToNewGroceryList = async (req, res) => {
  const info = req.body;
  const userId = req.userID;

  const added = await db.addToNewGroceryList(info, userId);

  if (added === null) {
    res.status(400).send();
  } else {
    res.status(200).send(added);
  }
};


exports.addToExistingGroceryList = async (req, res) => {
  const info = req.body;
  const userId = req.userID;

  const added = await db.addToExistingGroceryList(info, userId);

  if (added === null) {
    res.status(400).send();
  } else {
    res.status(200).send(added);
  }
};


exports.getAllFromFavorites = async (req, res) => {
  const info = req.userID;

  const gotten = await db.getAllFromFavorites(info);

  if (gotten === null) {
    res.status(400).send();
  } else if (gotten === []) {
    res.status(200).send([]);
  } else {
    res.status(200).send(gotten);
  }
};

exports.getGroceryLists = async (req, res) => {
  const memberIdd = req.userID;

  const gotten = await db.getGroceryLists(memberIdd);

  if (gotten === null) {
    res.status(400).send();
  } else if (gotten == []) {
    res.status(200).send(gotten);
  } else {
    res.status(200).send(gotten);
  }
};

exports.getAllFromGroceryList = async (req, res) => {
  const listId = req.query.groceryListID;
  console.log(listId);
  const memberId = req.userID;

  const gotten = await db.getAllFromGroceryList(listId);

  if (gotten === null) {
    res.status(400).send();
    return;
  }
  if (memberId !== gotten[0].member_id) {
    res.status(401).end();
    return;
  }
  gotten.map((item) => {
    delete item.member_id;
    return item;
  });

  res.status(200).send(gotten);
};


exports.deleteFromFavorites = async (req, res) => {
  const memberIdd = req.userID;
  const recipeIdd = req.query.recipeId;

  const deleted = await db.deleteFromFavorites(memberIdd, recipeIdd);

  if (deleted === null) {
    res.status(400).send();
  } else {
    res.status(200).send(deleted);
  }
};


exports.deleteGroceryList = async (req, res) => {
  const listNamee = req.query.listName;
  const memberIdd = req.userID;
  console.log('inside delete gl');
  console.log(listNamee);
  console.log(memberIdd);

  const deleted = await db.deleteGroceryList(listNamee, memberIdd);
  console.log('user.js line 286)\n');
  console.log(deleted);
  if (deleted === null) {
    res.status(400).send();
  } else {
    console.log('user.js line 292)\n');
    res.sendStatus(204);
  }
};


exports.deleteFromGroceryList = async (req, res) => {
  const memberIdd = req.userID;
  const groceryListIdd = req.query.groceryListId;
  const recipeIdd = req.query.recipeId;

  const deleted = await db.deleteFromGroceryList(memberIdd, groceryListIdd, recipeIdd);

  if (deleted === null) {
    res.status(400).send();
  } else {
    res.status(200).send(deleted);
  }
};

exports.addToMealCalendarTable = async (req, res) => {
  const info = req.body;
  const userId = req.userID;

  const added = await db.addToMealCalendarTable(info, userId);

  if (added === null) {
    res.status(400).send();
  } else {
    res.status(200).send(added);
  }
};

exports.getFromMealCalendarTable = async (req, res) => {
  const userId = req.userID;

  const gotten = await db.getAllFromMealCalendarTable(userId);

  if (gotten === null) {
    res.status(400).send();
  } else if (gotten === []) {
    res.status(200).send(gotten);
  } else {
    res.status(200).send(gotten);
  }
};

exports.deleteFromMealCalendarTable = async (req, res) => {
  const date = req.query.date;
  const mealId = req.query.mealId;
  const userId = req.userID;
  const mealType = req.query.mealType;

  const deleted = await db.deleteFromMealCalendarTable(date, mealId, userId, mealType);

  if (deleted === null) {
    res.status(400).send();
  } else {
    res.status(200).send(deleted);
  }
};

exports.getRecipesAndListNames = async (req, res) => {
  const userId = req.userID;

  // SELECT DISTINCT r.recipe, gr.quantity, gl.list_name, gl.created_at FROM recipe r, grocery_list gl, grocerys_recipe gr WHERE r.id = gr.recipe_id AND gl.id = gr.grocery_list_id AND gl.member_id = $1
  const gotten = await db.getRecipesAndListNames(userId);
  console.log('user.js line 359)\n');
  console.log(gotten);

  if (gotten === null) {
    res.status(400).send();
  } else if (gotten === []) {
    res.status(200).send(gotten);
  } else {
    res.status(200).send(gotten);
  }
};