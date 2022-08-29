const User = require("../models/User");
const bcrypt = require("bcrypt");
const { auth, admin } = require("../middleware/validation");

const router = require("express").Router();

//UPDATE
router.put("/:id", auth, async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/user/:id", auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get the user balance
router.get("/balance/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.balance);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update the user balance
router.put("/balance/:id",admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id);
    user.history.push({type:'Deposit',date: Date.now(),amount:req.body.balance}) 
    user.balance += req.body.balance
    user.save()
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", admin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS

router.get("/stats", admin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;