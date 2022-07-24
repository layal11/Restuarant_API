const router = require("express").Router();
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

const {
  ListItem,
  AddItem,
  UpdateItem,
  DeleteItem,
} = require("../controllers/ItemController");

router.get("/list", ListItem);

router.post("/add", [auth, upload], AddItem);

router.put("/update", auth, UpdateItem);

router.delete("/delete", auth, DeleteItem);

module.exports = router;
