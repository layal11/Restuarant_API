const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  ListCategory,
  AddCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../controllers/CategoryController");

router.get("/list", ListCategory);

router.post("/add", auth, AddCategory);

router.put("/update", auth, UpdateCategory);

router.delete("/delete", auth, DeleteCategory);

module.exports = router;
