const express = require("express");
const route = express.Router();
const loginController = require("../src/controllers/loginController");

route.get("/", loginController.index);
route.post("/register", loginController.register);
route.post("/enter", loginController.login);
route.get("/logout", loginController.logout);

module.exports = route;
