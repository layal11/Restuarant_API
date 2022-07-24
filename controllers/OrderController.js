const Address = require("../models/Address");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { Status } = require("../static/OrderStatus");

const ListOrder = async (req, res) => {
    try {
        const OrderList = await Order.find();
        if (OrderList) {
            res.status(200).json({ OrderList, status: true });
        } else {
            res.status(200).json({ OrderList: [], status: true });
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}
const AddOrder = async (req, res) => {
    try {
        const { orderNumber, items, totalprice, user } = req.body;
        const result = GetInRangeRestuarants(user._id);
        if (result && result.InRangeRestuarant && result.InRangeRestuarant._id) {
            const order = await Order.create({
                orderNumber,
                branchId: result.InRangeRestuarant._id,
                items,
                totalprice,
                user
            });

            if (order && order._id) {
                res.status(200).json({ result, order, status: true });
            } else {
                res
                    .status(200)
                    .json({
                        result,
                        order: {},
                        status: false,
                        message: "failed to create order",
                    });
            }
        } else {
            res
                .status(200)
                .json({
                    result,
                    order: {},
                    status: false,
                    message: "User out of range",
                });
        }

    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}
const UpdateOrder = async (req, res) => {
    try {
        const { status, items, totalprice, orderId } = req.body;
        if (status == Status.Cancelled) {

        } else {

        }
        const order = await Order.findOneAndUpdate({
            status,
            items,
            totalprice
        }, { _id: orderId });

        if (order && order._id) {
            res.status(200).json({ order, status: true });
        } else {
            res
                .status(200)
                .json({
                    result,
                    order: {},
                    status: false,
                    message: "failed to update order",
                });
        }


    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}
const DeleteOrder = async (req, res) => { }


const degreesToRadians = (degrees) => {
    return degrees * Math.PI / 180;
}
const distanceInKm = (lat1, lon1, lat2, lon2) => {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

const GetInRangeRestuarants = async (userId) => {
    const user = await User.findOne({ _id: userId });
    const restaurantList = await Restaurant.find({}, { branch: 1 });
    var InRangeRestuarant = undefined;
    var address = undefined;
    var branchList = [];
    for (let i in restaurantList) {
        if (restaurantList[i].branch.length > 0) {
            branchList.concat(restaurantList[i].branch);
        }
    }
    for (let i in branchList) {
        address = await Address.find({ _id: branchList[i].addressId });
        if (address && address._id) {
            if (distanceInKm(address.geoLocation.long, address.geoLocation.lat, user.geoLocation.long, user.geoLocation.lat) <= 5) {
                InRangeRestuarant = branchList[i]
                break;
            }
        }
    }
    return { InRangeRestuarant, address, user };
}


module.exports = { ListOrder, AddOrder, UpdateOrder, DeleteOrder }