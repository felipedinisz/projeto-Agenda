const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.validate();
    if (this.errors.length > 0) return;

    const { email, password } = this.body;

    this.user = await LoginModel.findOne({ email });

    if (!this.user) return this.errors.push("Usuário não existe.");

    if (!bcrypt.compareSync(password, this.user.password)) {
      this.errors.push("Senha inválida.");
      this.user = null;
      return;
    }
  }

  async register() {
    this.validate();
    await this.registerValidations();

    if (this.errors.length > 0) return;

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  validate() {
    this.cleanUp();
    // * Validação

    const { email, password } = this.body;

    // ! Os campos precisam ser preenchidos.
    if (email === "" || password === "")
      return this.errors.push("Os campos precisam ser preenchidos.");
    // ! e-mail precisa ser válido
    if (!validator.isEmail(email)) this.errors.push("E-mail inválido.");
    // ! Senha precisa ter entre 3 a 50 caracteres
    if (password.length < 3 || password.length >= 50)
      return this.errors.push("A senha precisa ter entre 3 a 50 caracteres.");
  }

  async registerValidations() {
    // ! Verifica se as senhas são iguais
    const { email, password, confirmpassword } = this.body;
    if (password !== confirmpassword)
      return this.errors.push("As senhas precisam ser iguais.");

    // ! verifica se o email já está no sistema.
    this.user = await LoginModel.findOne({ email });
    if (this.user) return this.errors.push("Usuário já cadastrado no sistema.");
  }

  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") this.body[key] = "";
    }

    const { email, password, confirmpassword } = this.body;
    this.body = { email, password, confirmpassword };
  }

}

module.exports = Login;
