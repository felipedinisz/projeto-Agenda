const express = require("express");
const route = express.Router();
const contactControllers = require("../src/controllers/contactControllers");
const { loginRequired } = require("../src/middlewares/middleware")

route.get("/", loginRequired, contactControllers.index);
route.get("/:id", loginRequired, contactControllers.editIndex);
route.post("/register", loginRequired, contactControllers.register);
route.post("/edit/:id", loginRequired, contactControllers.edit);
route.get("/delete/:id", loginRequired, contactControllers.delete);

module.exports = route;
