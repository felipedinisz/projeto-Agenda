require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.emit("ok");
  })
  .catch((e) => console.log(e));

const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const homeRoutes = require("./routes/homeRoutes");
const loginRoutes = require("./routes/loginRoutes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const {
  middlewareGlobal,
  checkCsrfError,
  csrfMiddleware,
} = require("./src/middlewares/middleware");

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "kh uiwahirvqwihihdiahsijdhisha viqwoeuwqe qouwopaodjksoa()",
  store: new mongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());


app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use("/", homeRoutes);
app.use("/login", loginRoutes)

app.on("ok", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
