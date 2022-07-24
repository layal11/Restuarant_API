const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const GetUser = async (req, res) => {
  try {
    const UserId = req.params.id;
    const user = await User.findById(UserId);
    if (user) {
      res.status(200).json({ user, status: true });
    } else {
      res.status(404).json({ status: false, message: `user doesn't exist` });
    }
  } catch (e) {
    res.status(500).send("Internal Server Error!");
  }
};

const DeleteUsers = async (req, res) => {
  try {
    const UserId = req.body.user_id;
    const token = req.headers.authorization;
    const loggedInUser = req.user.user;
    if (loggedInUser && loggedInUser.isAdmin) {
      const DeleteRes = await User.deleteOne({ _id: UserId });
      console.log(DeleteRes);
      res
        .status(200)
        .json({ authorization: token, res: DeleteRes, status: true });
    } else {
      res
        .status(400)
        .json({ users: [], status: false, message: "Invalid token" });
    }
  } catch (e) {
    res.status(500).json({
      users: [],
      status: false,
      error: e,
      message: "Error while getting users",
    });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const UserId = req.body.user_id;
    const token = req.headers.authorization;
    const { fullName, city, province, postalCode } = req.body;
    const loggedInUser = req.user.user;
    if (loggedInUser) {
      const userData = await User.findOne({ username: loggedInUser.username });
      if (userData && (userData._id == UserId || loggedInUser.isAdmin)) {
        const UpdateRes = await User.updateOne(
          { _id: UserId },
          {
            $set: {
              fullName,
            },
            // $push: {
            //   address: {
            //     city,
            //     province,
            //     postalCode
            //   }
            // }
          }
        );
        res
          .status(200)
          .json({ authorization: token, res: UpdateRes, status: true });
      } else {
        res
          .status(400)
          .json({
            users: [],
            status: false,
            message: "you have no access to update this user",
          });
      }
    } else {
      res
        .status(400)
        .json({ users: [], status: false, message: "Invalid token" });
    }
  } catch (e) {
    res.status(500).json({
      users: [],
      status: false,
      error: e,
      message: "Error while getting users",
    });
  }
};

const SignIn = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username: email });
    const pwdcheck = await bcrypt.compare(password, user.password);
    if (user && pwdcheck) {
      // Create token
      const token = jwt.sign(
        { user: { isAdmin: user.isAdmin, username: user.username } },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.authorization.token = token;
      user.save();

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error!");
  }
};

const SignUp = async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { fullName, email, password } = req.body;
    // Validate user input
    if (!(email && password && fullName)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username: email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      fullName,
      username: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user: { isAdmin: user.isAdmin, username: user.username } },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    console.log(token);
    user.authorization.token = token;
    user.save();
    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error!");
  }
  // Our register logic ends here
};

const Activate = async (req, res) => {
  try {
    const { isActive, userId } = req.body;
    const loggedInUser = req.user.user;
    if (loggedInUser && loggedInUser.isAdmin) {
      if (isActive != undefined && isActive != null && userId) {
        const user = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { isActive } }
        );
        return res.status(200).json({ user, status: true });
      } else {
        return res
          .status(403)
          .send(
            "Please provide all the necessary field for this request to work."
          );
      }
    } else {
      res
        .status(400)
        .json({ users: [], status: false, message: "Invalid token" });
    }
  } catch (e) {
    res.status(500).send("Internal Server Error!");
  }
};
module.exports = { GetUser, DeleteUsers, SignIn, SignUp, UpdateUser, Activate };
