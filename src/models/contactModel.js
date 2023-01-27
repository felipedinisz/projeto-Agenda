const mongoose = require("mongoose");
const validator = require("validator");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: false,
    default: "",
  },
  email: {
    type: String,
    required: false,
    default: "",
  },
  telephone: {
    type: String,
    required: false,
    default: "",
  },
  createdIn: {
    type: Date,
    required: false,
    default: Date.now(),
  },
});

const ContactModel = mongoose.model("Contact", ContactSchema);

ContactSchema.index({ createdIn: 1 });

class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
  }
  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.create(this.body);
  }
  validate() {
    this.cleanUp();
    // * Validação
    const { name, email, telephone } = this.body;

    // ! e-mail precisa ser válido
    if (email && !validator.isEmail(email))
      this.errors.push("E-mail inválido.");

    // ! nome precisa ser um campo preenchido.
    if (!name) this.errors.push("Nome é um campo obrigatório.");

    // ! verifica se há alguma forma de contato.
    if (!email && !telephone)
      this.errors.push(
        "Coloque pelo menos uma forma de contato: e-mail ou telefone."
      );
  }

  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") this.body[key] = "";
    }

    const { name, surname, email, telephone } = this.body;
    this.body = { name, surname, email, telephone };
  }

  async edit(id) {
    if (typeof id !== "string") return;
    this.validate();
    if (this.errors.length > 0) return;

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }
}

module.exports = {
  Contact,
  searchId: async function searchId(id) {
    if (typeof id !== "string") return;
    const contact = await ContactModel.findById(id);
    return contact;
  },
  searchContacts: async function searchId() {
    const contacts = await ContactModel.find()
    .sort({ createdIn: -1});
    return contacts;
  },
  deleteContact: async function deleteContact(id){
    if (typeof id !== "string") return;
    const contact = await ContactModel.findOneAndDelete({_id: id});
    return contact;
  }
};
