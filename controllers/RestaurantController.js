const Restaurant = require("../models/Restaurant");

const ListRestaurant = async (req, res) => {
    try {
        const loggedInUser = req.user.user;
        if (loggedInUser && loggedInUser.isAdmin) {
            const restaurantList = await Restaurant.find();
            if (restaurantList) {
                res.status(200).json({ restaurantList, status: true });
            } else {
                res.status(200).json({ restaurantList: [], status: false });
            }
        } else {
            res
                .status(401)
                .json({ status: false, message: "Invalid token" });
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}

const AddRestaurant = async (req, res) => {
    try {
        const loggedInUser = req.user.user;
        const { name, branch, description, restaurantId } = req.body;
        var oldrestaurant = undefined;
        if (restaurantId) {
            oldrestaurant = Restaurant.find({ _id: restaurantId })
        }

        if (loggedInUser && loggedInUser.isAdmin) {
            var restaurant = undefined;
            if (oldrestaurant && oldrestaurant._id) {
                restaurant = await Restaurant.findOneAndUpdate({ _id: oldrestaurant._id }, {
                    $set: { description },
                    $push: { branch: branch }
                });
            } else {
                restaurant = await Restaurant.create({
                    name,
                    branch: [branch],
                    description
                });
            }

            if (restaurant && restaurant._id) {
                res.status(200).json({ restaurant, status: true });
            } else {
                res.status(200).json({ restaurant: {}, status: false, message: "failed to create restaurant" });
            }
        } else {
            res
                .status(401)
                .json({ status: false, message: "Invalid token" });
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}

const UpdateRestaurant = async (req, res) => {
    try {
        const loggedInUser = req.user.user;
        const { branch, restaurantId, branch_id } = req.body;
        if (loggedInUser && loggedInUser.isAdmin) {
            const updateRestaurant = await Restaurant.findOneAndUpdate({ _id: restaurantId, 'branch._id': branch_id }, {
                $set: { branch }
            });
            if (updateRestaurant && updateRestaurant._id) {
                res.status(200).json({ restaurant: updateRestaurant, status: true });
            } else {
                res.status(200).json({ restaurant: {}, status: false, message: "failed to update restaurant" });
            }
        } else {
            res
                .status(401)
                .json({ status: false, message: "Invalid token" });
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}

const DeleteRestaurant = async (req, res) => {
    try {
        const loggedInUser = req.user.user;
        const { restaurantId, branchId } = req.body;
        if (loggedInUser && loggedInUser.isAdmin) {
            const deletedRestaurant = await Restaurant.findOneAndUpdate({ _id: restaurantId },
                {
                    $pull: { branch: { _id: branchId } }
                });
            if (deletedRestaurant) {
                res.status(200).json({ status: true });
            } else {
                res.status(200).json({ status: false, message: "failed to delete restaurant" });
            }
        } else {
            res
                .status(401)
                .json({ status: false, message: "Invalid token" });
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { ListRestaurant, AddRestaurant, UpdateRestaurant, DeleteRestaurant };