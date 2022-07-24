const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  authorization: {
    token: {
      type: String,
      required: false,
    },
    exp: {
      type: Date,
      required: false,
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: false,
  },
  address: [
    {
      geoLocation: {
        long: {
          type: Number,
          required: false,
        },
        lat: {
          type: Number,
          required: false,
        },
      },
      city: {
        type: String,
        required: false,
      },
      province: {
        type: String,
        required: false,
      },
      postalCode: {
        type: String,
        required: false,
      },
    },
  ],
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
