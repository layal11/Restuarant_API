const router = require("express").Router();
const auth = require("../middleware/auth");

const { ListRestaurant, AddRestaurant, UpdateRestaurant, DeleteRestaurant } = require("../controllers/RestaurantController");

router.get("/list", auth, ListRestaurant);

router.post("/add", auth, AddRestaurant);

router.put("/update", auth, UpdateRestaurant);

router.delete("/delete", auth, DeleteRestaurant);

module.exports = router;