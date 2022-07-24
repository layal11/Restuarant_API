const router = require("express").Router();
const auth = require("../middleware/auth");

const { ListOrder, AddOrder, UpdateOrder, DeleteOrder } = require("../controllers/OrderController");

router.get("/list", auth, ListOrder);

router.post("/add", auth, AddOrder);

router.put("/update", auth, UpdateOrder);

router.delete("/delete", auth, DeleteOrder);

module.exports = router;