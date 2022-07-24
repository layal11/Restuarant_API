const router = require("express").Router();

const { ListAddress, AddAddress, UpdateAddress, DeleteAddress } = require("../controllers/AddressController");

router.get("/list", ListAddress);

router.post("/add", AddAddress);

router.put("/update", UpdateAddress);

router.delete("/delete", DeleteAddress);

module.exports = router;