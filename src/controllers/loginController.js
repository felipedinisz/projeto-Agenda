const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  res.render("login");
  return;
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      return req.session.save(() => res.redirect("/login"));
    }

    req.flash("success", "Seu usuário foi criado com sucesso.");
    req.session.save(() => res.redirect("/login"));

  } catch (e) {
    console.error("ocorreu um erro durante a criação do usuário: " + e)
    return res.render('404');
  }

};

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      return req.session.save(() => res.redirect("/login"));
    }


    req.flash("success", "Você logou com sucesso!");
    req.session.user = login.user;
    req.session.save(() => res.redirect("/login"));

  } catch (e) {
    console.error("ocorreu um erro durante a criação do usuário: " + e)
    return res.render('404');
  }

};
