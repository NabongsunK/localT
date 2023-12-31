const dotenv = require("dotenv");

// 기본 .env 파일 로딩
dotenv.config({ path: ".env" });
// 환경별 .env 파일 로딩
console.log("NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV) {
  dotenv.config({ override: true, path: `.env.${process.env.NODE_ENV}` });
}

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "..", "app-server", "build")));

// 교차출처 처리
// 서버가 다르면 추가
app.use(cors());
app.use("/api", indexRouter);

// 404 에러 처리
app.use("/api", (req, res, next) => {
  console.error(404, req.url);
  res.json({ error: { message: "404::존재하지 않는 API입니다." } });
});

// React용 fallback 추가
app.use("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "app-server", "build", "index.html"));
});

// 500 에러 처리
app.use((err, req, res, next) => {
  console.error(err.stack);
  console.error(err.cause);
  res.json({
    error: {
      message: "500::요청을 처리할 수 없습니다. 잠시 후 다시 요청해 주세요.",
    },
  });
});

module.exports = app;
