const Item = require("../models/Item");
const ListItem = async (req, res) => {
  try {
    const search = req.query.search;
    const category = req.query.category;
    var limit = req.query.limit;
    try {
      limit = parseInt(limit);
    } catch (e) {
      limit = [];
    }
    var offset = req.query.offset;
    try {
      offset = parseInt(offset);
    } catch (e) {
      limit = undefined;
    }
    var items = undefined;
    var query = (search && search.length > 0) ? { name: { $regex: `.*${search}.*` } } : undefined;
    query = (query) ? ((category && category.length > 0) ? { ...query, 'category.categoryId': { $in: category } } : query) : ((category && category.length > 0) ? { 'category.categoryId': { $in: category } } : query);
    if (limit && limit > 0 && offset && offset > 0) {
      items = await Item.find(query).skip(offset).limit(limit);
    } else {
      if ((limit && limit > 0) && (!offset || offset == 0)) {
        items = await Item.find(query).skip(0).limit(limit);
      } else {
        if ((offset && offset > 0) && (!limit || limit == 0)) {
          items = await Item.find(query).skip(offset);
        } else {
          items = await Item.find(query);
        }
      }
    }
    if (items.length === 0) {
      res.status(200).json({ status: true, message: "no items to show" });
    } else {
      res.status(200).json({ status: true, items });
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error");
  }
};


const AddItem = async (req, res) => {
  try {
    const { name, category, image, price, description } = req.body;
    const token = req.headers.authorization;

    const loggedInUser = req.user.user;
    if (loggedInUser && loggedInUser.isAdmin) {
      // check if item exists?
      const itemExist = await Item.findOne({ name });
      if (!itemExist) {
        const item = new Item({
          name: name,
          category: [category],
          // image: filename,
          price: price,
          description: description,
        });
        const data = await item.save();
        res.status(200).json({ authorization: token, res: data, status: true });
      } else {
        res.status(200).json({ authorization: token, status: true, message: "Item already exists" });
      }
    } else {
      res.status(400).send("Unauthorized user");
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Internal Server Error");
  }
};


const UpdateItem = async (req, res) => {
  try {
    const { itemId, name, category, image, price, description, isActive } = req.body;
    const token = req.headers.authorization;

    const loggedInUser = req.user.user;
    if (loggedInUser && loggedInUser.isAdmin) {
      const Updateditem = await Item.findOneAndUpdate({ _id: itemId },
        {
          $set: {
            name,
            isActive,
            price,
            description
          }
        });
      if (Updateditem) {
        res.status(200).json({ status: true, item });
      } else {
        res.status(200).json({ status: false, item });
      }
    } else {
      res.status(400).send("Unauthorized user");
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const DeleteItem = async (req, res) => {
  try {
    const { user } = req.user;
    const { itemId } = req.body;
    // const itemId = req.body.itemId;
    if (user && user.isAdmin) {
      if (itemId) {
        const deleteresitem = await Item.deleteOne({ _id: itemId })
        if (deleteresitem) {
          res.status(200).json({ status: true, message: 'Item deleted successfully' });
        } else {
          res.status(500).send(`Error while deleting item of id ${itemId}`);
        }
      } else {
        res.status(500).send("Item id is missing");
      }
    } else {
      res.status(400).send("Unauthorized user");
    }
  } catch (e) {
    res.status(500).send("Internal server error");
  }
};

module.exports = { ListItem, AddItem, UpdateItem, DeleteItem };
