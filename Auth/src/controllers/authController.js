const express = require('express');
const router = express.Router();
const { login, register } = require('../services/authService');


router.route('/register')
  .post(async (req, res) => {
    try {
      const credentials = req.body;
      const result = await register(credentials);
      if (result.error) return res.status(401).json({ error: result.error });
      res.header('x-auth-token', result.token);
      return res.status(200).json(result.user);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }
  });

router.route('/login')
  .post(async (req, res) => {
    try {
      const credentials = req.body;
      const Result = await login(credentials);
      if (Result.error == "Invalid login credentials") return res.status(401).json({ error: Result.error });
      if(Result.error == "User not found") return res.status(404).json({ error: Result.error });
      res.header('x-auth-token', Result.token);
      res.status(200).json(Result.user);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: err.message });
    }
  });