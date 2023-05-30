const User = require("../../models/user");
const Account = require("../../models/account");
const { validationResult } = require("express-validator");
require("dotenv").config();

exports.updateUserProfile1 = async (req, res) => {
  const id = req.user._id;

  content = {
    avatar : req.body.avatar,
    location: req.body.location,
    website: req.body.website,
    about: req.body.about,
  };

  if (req.body.avatar != null) {
    content.avatar = req.body.avatar;
  }

  await Account.findOneAndUpdate(
    { user_id: id, deleted_at: null },
    { $set: content },
    { new: true },
    (err, account) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      }

      if (account === null) {
        return res.status(404).json({
          message: "No Data Found",
        });
      }

      res.send({ message: "Successfully Updated" });
    }
  );
};

exports.updateUserProfile2 = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  const id = req.user._id;

  account_content = {
    company: req.body.company,
    name: req.body.name,
    address_street: req.body.address_street,
    address_city: req.body.address_city,
    address_state: req.body.address_state,
    address_zip: req.body.address_zip,
    address_country: req.body.address_country,
  };

  user_content = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
  };
  try {
    await Account.findOneAndUpdate(
      { user_id: id, deleted_at: null },
      { $set: account_content },
      { new: true },
      (err, account) => {}
    );

    await User.findOneAndUpdate(
      { _id: id, deleted_at: null },
      { $set: user_content },
      { new: true },
      (err, user) => {}
    );
    res.send({ message: "Successfully Updated" });
  } catch (error) {
    res.status(500).send({
      message: error,
    });
  }
};

exports.get_profile = (req, res) => {
  User.findOne({ _id: req.user._id })
    .select("-password")
    .populate("account_id")
    .then(function (user) {
      if (!user) {
        res.json({ error: "User Not Found." });
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting user.",
      });
    });
};

exports.supplierProfileUpdate = async (req, res) => {
  console.log("request::", req);

  const id = req.user._id;

  content = {
    title: req.body.title,
    phone: req.body.phone,
    name: req.body.name,
    address_street: req.body.address_street,
    address_city: req.body.address_city,
    about: req.body.about,
    vendor_email: req.body.vendor_email,
    store_name: req.body.store_name,
    company: req.body.company,
    address_state: req.body.address_state,
    address_zip: req.body.address_zip,
    address_country: req.body.address_country,
    stripe_secret_key: req.body.secret_key,
    stripe_publishable_key: req.body.publishable_key,
  };

  if (req.body.avatar != null) {
    content.avatar = req.body.avatar;
  }

  if (req.body.cover != null) {
    content.cover = req.body.cover;
  }

  await Account.findOneAndUpdate(
    { user_id: id, deleted_at: null },
    { $set: content },
    { new: true },
    (err, account) => {
      if (err) {
        return res.status(404).json({
          error: err,
        });
      }

      if (account === null) {
        return res.status(404).json({
          message: "No Data Found",
        });
      }

      res.send({ message: "Successfully Updated" });
    }
  );
};

exports.blackblaze = async (req, res) => {
  return res.json("Controller");
};
