const router = require("express").Router();
const {
  mainPage, logPage,
} = require("../controllers/controller");

module.exports = function (io) {
  router.get("/", mainPage);
  router.get("/log", logPage);
  return router;
};
