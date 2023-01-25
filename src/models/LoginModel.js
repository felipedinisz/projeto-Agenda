const mongoose = require("mongoose");
const validator = require("validator");

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

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    try {
      this.user = await LoginModel.create(this.body);
    } catch (e) {
      console.error(
        "Algum erro ocorreu cadastrando o usuário no servidor: " + e
      );
    }
  }

  validate() {
    this.cleanUp();
    // * Validação

    const { email, password, confirmpassword } = this.body;

    // ! Os campos precisam ser preenchidos.
    if (email === "" || password === "")
      this.errors.push("Os campos precisam ser preenchidos.");
    // ! e-mail precisa ser válido
    if (!validator.isEmail(email)) this.errors.push("E-mail inválido.");
    // ! Senha precisa ter entre 3 a 50 caracteres
    if (password.length < 3 || password.length >= 50)
      this.errors.push("A senha precisa ter entre 3 a 50 caracteres.");
    // ! Senha e confirma senha precisam ser iguais.
    if (password !== confirmpassword)
      this.errors.push("As senhas precisam ser iguais.");
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
