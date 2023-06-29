const router = require("express").Router();
const userRoutes = require("./users");
const cardRoutes = require("./cards");

// главная страница
router.get("/", function (req, res) {
  res.send("hello world");
});
router.use("", userRoutes);
router.use("/cards", cardRoutes);

router.all("*", (req, res) => {
  res.status(404).send("<h1>404! Страница не найдена</h1>");
});

module.exports = router;
