const { response } = require("express");

var that = (module.exports = {
  mainPage: async (req, res, next) => {
    res.render(__basedir + "/views/main.ejs");
  },
});
