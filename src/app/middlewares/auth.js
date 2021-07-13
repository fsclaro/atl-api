const jwt = require('jsonwebtoken');
require('dotenv').config();

const authConfig = { secret: process.env.API_SECRET_KEY };

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: 'Token não informado.' });
  }

  const token = authHeader.split(' ');

  if (token.length !== 2) {
    return res.status(401).send({ error: 'Token inválido.' });
  }

  const [tokenType, tokenValue] = token;

  if (!/^Bearer$/i.test(tokenType)) {
    return res.status(401).send({ error: 'Token mal formatado.' });
  }

  jwt.verify(tokenValue, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: 'Token inválido.' });
    }

    req.userId = decoded.id;

    return next();
  });
};
