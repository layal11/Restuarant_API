const mongoose = require("mongoose");

const RestaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    branch: [
        {
            name: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                required: false,
                default: true,
            },
            addressId: {
                type: String,
                required: false,
            }
        }
    ],
    description: {
        type: String,
        required: false,
    },
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
module.exports = Restaurant;
