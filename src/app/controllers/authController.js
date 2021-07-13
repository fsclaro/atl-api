const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/users');
const mailer = require('../../modules/mailer');
require('dotenv').config();

const authConfig = { secret: process.env.API_SECRET_KEY };

const router = express.Router();

function generateToken(id) {
  const token = jwt.sign({ id: id }, authConfig.secret, { expiresIn: '1h' });

  return token;
}


// get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('tasks');

    return res.json({ users });
  } catch (error) {
    return res.
      status(400).
      send({ error: 'Não foi possível buscar os usuários.\n' + error.message });
  }
});

// permit register new user
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Usuário já cadastrado.' });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    const token = generateToken(user._id);

    return res.send({ user, token });
  } catch (error) {
    return res.status(400).send({ error: 'Erro no registro do usuário.\n' + error.message });
  }
});

// permit login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).send({ error: 'Usuário não encontrado.' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: 'Senha incorreta.' });
    }

    user.password = undefined;
    const token = generateToken(user._id);

    returnData = {
      user: user,
      token: token,
    };

    return res.status(200).send(returnData);
  } catch (error) {
    return res.status(400).send({ error: 'Erro no login do usuário.\n' + error.message });
  }
});

// send email to user when forgot password
router.post('/forgot_password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: 'Usuário não encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setDate(now.getDate() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      }},
      { useFindAndModify: false},
    );

    const mail = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Redefinição de senha',
      template: 'auth/forgot_password',
      context: { token },
    };

    mailer.sendMail(mail, (err) => {
      if (err) {
        return res.status(400).send({ error: 'Erro ao enviar o e-mail de recuperação de senha.' });
      }
     });

    return res.send();
  } catch (error) {
    return res.status(400).send({ error: 'Error on forgot password. Try again.\n' + error.message });
  }
});


// permit change password
router.post('/reset_password', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

    if (!user) {
      return res.status(400).send({ error: 'Usuário não encontrado.' });
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Token incorreto.' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(400).send({ error: 'Token expirado.' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.send();
  }
  catch (error) {
    return res.status(400).send({ error: 'Erro no reset do password.\n' + error.message });
  }
});

module.exports = (app) => app.use('/auth', router);
