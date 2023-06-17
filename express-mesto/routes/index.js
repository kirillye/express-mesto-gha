const router = require("express").Router();
const userRoutes = require("./users");
const cardRoutes = require("./cards");

// главная страница
router.get("/", function (req, res) {
  res.send("hello world");
});

router.use("/users", userRoutes);
router.use("/cards", cardRoutes);

module.exports = router;
