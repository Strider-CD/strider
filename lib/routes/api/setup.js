'use strict';

var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
  // TODO: implement lol
  var config = req.body;
  console.log(config);
  res.json(config);
});

module.exports = router;
