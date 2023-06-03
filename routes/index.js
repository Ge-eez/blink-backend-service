var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    title: 'Blink Sign Language Translation and Learning Platform',
    message: 'Welcome to our platform! Here you can learn sign language, take challenges and track your progress.',
    version: '1.0.0'
  });
});

module.exports = router;
