const express = require("express");
const router = express();
const path = require("path");

router.get("^/$|/index(.html)?", (req, res) => {
  res.send("Final Project");
});

module.exports = router;