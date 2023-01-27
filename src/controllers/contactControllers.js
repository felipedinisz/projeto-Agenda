const { Contact, searchId, deleteContact } = require("../models/contactModel");

exports.index = (req, res) => {
  res.render("contact", {
    contact: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register();

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => res.redirect("/contact"));
      return;
    }

    req.flash("success", "Contato registrado com sucesso.");
    req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
    return;
  } catch (e) {
    console.error("Ocorreu um erro ao cadastrar o contato: " + e);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const contact = await searchId(req.params.id);
  if (!contact) return res.render("404");

  res.render("contact", {
    contact,
  });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contact = new Contact(req.body);
    await contact.edit(req.params.id);

    if (contact.errors.length > 0) {
      req.flash("errors", contact.errors);
      req.session.save(() => res.redirect("/contact"));
      return;
    }

    req.flash("success", "Contato editado com sucesso.");
    req.session.save(() => res.redirect(`/contact/${contact.contact._id}`));
    return;
  } catch (e) {
    console.error("Ocorreu um erro ao editar o contato: " + e);
    return res.render("404");
  }
};


exports.delete = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const contact = await deleteContact(req.params.id);
  if (!contact) return res.render("404");

  req.flash("success", "Contato apagado com sucesso.");
    req.session.save(() => res.redirect(`back`));
    return;
}
