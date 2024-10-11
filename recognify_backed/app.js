require("dotenv").config();
const { env } = require("node:process");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

const allowedOrigins = [
  "http://localhost",
  "http://localhost:4200",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:8100",
  "http://192.168.1.12:5000/",
  "http://13.233.159.201:5000",
  "http://localhost:5000",
];

const corsOptions = {
  // origin: allowedOrigins,
};
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "recongnify")));
app.use(express.static("profile"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userRouter = require("./routes/userRoutes");
const clientRouter = require("./routes/clientRoutes");
const leadRouter = require("./routes/leadRoutes");
const partnersRouter = require("./routes/partnersRoutes");
const partnersWorkRouter = require("./routes/partnersWorkRouter");
const projectRouter = require("./routes/projectRoutes");
const paymentsRouter = require("./routes/paymentsRoutes.js");
const dashboardRouter = require("./routes/dashboardRouter");

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./recongnify/index.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/dashboard"));
});

app.use("/user", userRouter);
app.use("/lead", leadRouter);
app.use("/client", clientRouter);
app.use("/partners", partnersRouter);
app.use("/partners_work", partnersWorkRouter);
app.use("/project", projectRouter);
app.use("/payments", paymentsRouter);
app.use("/dashboard", dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


// module.exports = app;

app.listen(process.env.PORT,()=>{
console.log("server is running...")
},)
