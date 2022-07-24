const Address = require("../models/Address");

const ListAddress = async (req, res) => {
  try {
    const addressList = await Address.find();
    if (addressList) {
      res.status(200).json({ addressList, status: true });
    } else {
      res.status(200).json({ addressList: [], status: true });
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const AddAddress = async (req, res) => {
  try {
    const { label, geoLocation, city, province, postalCode } = req.body;
    const address = await Address.create({
      label,
      geoLocation,
      city,
      province,
      postalCode,
    });

    if (address && address._id) {
      res.status(200).json({ address, status: true });
    } else {
      res
        .status(200)
        .json({
          address: {},
          status: false,
          message: "failed to create address",
        });
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const UpdateAddress = async (req, res) => {
  try {
    const { addressId, label, geoLocation, city, province, postalCode } =
      req.body;
    const updateRes = await Address.findOneAndUpdate(
      { _id: addressId },
      { label, geoLocation, city, province, postalCode }
    );

    if (updateRes && updateRes._id) {
      res.status(200).json({ address: updateRes, status: true });
    } else {
      res
        .status(200)
        .json({
          address: {},
          status: false,
          message: "failed to update address",
        });
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

const DeleteAddress = async (req, res) => {
  try {
    const { addressId } = req.body;
    const deleteRes = await Address.findOneAndDelete({ _id: addressId });

    if (deleteRes) {
      res
        .status(200)
        .json({ status: true, message: "Address deleted successfully" });
    } else {
      res
        .status(200)
        .json({ status: false, message: "failed to delete address" });
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { ListAddress, AddAddress, UpdateAddress, DeleteAddress };
