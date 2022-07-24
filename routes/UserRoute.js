const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  Activate,
  GetUser,
  SignIn,
  SignUp,
  DeleteUsers,
  UpdateUser,
} = require("../controllers/UserController");

router.get("/:id", auth, GetUser);

router.post("/login", SignIn);

router.post("/register", SignUp);

router.put("/activate", auth, Activate);

router.delete("/delete", auth, DeleteUsers);

router.put("/update", auth, UpdateUser);

module.exports = router;
