const secret = require('./data/secret.json');
const jwt = require('jsonwebtoken');
const db = require('./db');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);


exports.checkAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret.accessToken, (err, token) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      } else {
        req.userID = token.id;
        console.log('loggin token.id:\n');
        console.log(token.id);
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};

exports.checkRegistraionToken = (req, res, next) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, secret.registrationToken, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.email = decoded.email;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

exports.checkResetPasswordToken = (req, res, next) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, secret.resetPasswordToken, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.email = decoded.email;
      req.oldPassword = decoded.password;

      next();
    });
  } else {
    res.sendStatus(401);
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const info = req.body;

    const name = info.name;
    const email = info.email;
    const picture = info.picture;


    await db.upsertGoogleUser(email);
    const id = await db.getUserId(email);

    const accessToken = jwt.sign(
      {email: email, id: id},
      secrets, {
        expiresIn: '25m',
        algorithm: 'HS256',
      });

    const response = {name, email, id, accessToken, picture};

    res.status(200).json(response);
  } catch (e) {
    console.log('console.loggin e');
    console.log(e);
  }
};

