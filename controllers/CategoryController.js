const Category = require("../models/Category");

const ListCategory = async (req, res) => {
    try {
        const search = req.query.search;
        var limit = req.query.limit;
        try {
            limit = parseInt(limit);
        } catch (e) {
            limit = undefined;
        }
        var offset = req.query.offset;
        try {
            offset = parseInt(offset);
        } catch (e) {
            limit = undefined;
        }
        var categories = [];
        const query = (search && search.length > 0) ? { name: { $regex: `.*${search}.*` } } : undefined;
        if (limit && limit > 0 && offset && offset > 0) {
            categories = await Category.find(query).skip(offset).limit(limit);
        } else {
            if ((limit && limit > 0) && (!offset || offset == 0)) {
                categories = await Category.find(query).skip(0).limit(limit);
            } else {
                if ((offset && offset > 0) && (!limit || limit == 0)) {
                    categories = await Category.find(query).skip(offset);
                } else {
                    categories = await Category.find(query);
                }
            }
        }
        if (categories.length === 0) {
            res.status(200).json({ status: true, message: "no categories to show" });
        } else {
            res.status(200).json({ status: true, categories });
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("Internal Server Error");
    }
};

const AddCategory = async (req, res) => {
    try {
        const { name, isActive } = req.body;
        const loggedInUser = req.user.user;
        if (loggedInUser && loggedInUser.isAdmin) {
            if (name) {
                const category = await Category.create({
                    name,
                    isActive: (isActive != undefined && isActive != null) ? isActive : false
                });
                if (category && category._id) {
                    res.status(200).json({ category, status: true });
                }
                else {
                    res.status(200).json({ category: {}, status: false });
                }
            } else {
                res.status(403).send("Request data missing");
            }
        } else {
            res.status(400).send("Unauthorized user");
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
};

const UpdateCategory = async (req, res) => {
    try {
        const { name, isActive, categoryId } = req.body;
        const loggedInUser = req.user.user;
        if (loggedInUser && loggedInUser.isAdmin) {
            if (name) {
                const category = await Category.findOneAndUpdate({ _id: categoryId }, {
                    name,
                    isActive: (isActive != undefined && isActive != null) ? isActive : false
                });
                if (category) {
                    res.status(200).json({ category, status: true });
                }
                else {
                    res.status(200).json({ category, status: false, message: 'category not found' });
                }
            } else {
                res.status(403).send("Request data missing");
            }
        } else {
            res.status(400).send("Unauthorized user");
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
};

const DeleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;
        const loggedInUser = req.user.user;
        if (loggedInUser && loggedInUser.isAdmin) {
            const category = await Category.findOneAndDelete({ _id: categoryId });
            if (category) {
                res.status(200).json({ category, status: true });
            } else {
                res.status(200).json({ category, status: false, message: 'Category not found' });
            }
        } else {
            res.status(400).send("Unauthorized user");
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
};




module.exports = { ListCategory, AddCategory, UpdateCategory, DeleteCategory };
