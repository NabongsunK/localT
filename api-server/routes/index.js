var express = require("express");
var router = express.Router({ mergeParams: true });

const authRouter = require("./auth");
const loginRouter = require("./login");
const exploreRouter = require("./explore");
const cartRouter = require("./cart");
const reviewRouter = require("./review");
const findpwRouter = require("./findpw");
const favoriteRouter = require("./favorite");
router.use("/auth", authRouter);
router.use("/login", loginRouter);
router.use("/explore", exploreRouter);
router.use("/cart", cartRouter);
router.use("/review", reviewRouter);
router.use("/findpw", findpwRouter);
router.use("/favorite", favoriteRouter);

module.exports = router;
