const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema({
    label: {
        type: String,
        required: false,
    },
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
});

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
