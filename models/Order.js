const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    branchId: {
        type: String,
        required: false,
    },
    items: [
        {
            itemId: {
                type: String,
                required: false,
            }
        },
    ],
    status: {
        type: Number,
        required: false,
        default: 0,
    },
    totalprice: {
        type: Number,
        required: false,
        default: 0,
    },
    user: {
        type: String,
        required: false,
    },
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
