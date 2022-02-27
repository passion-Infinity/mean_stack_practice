const express = require('express');
const router = express.Router();
const User = require('../model/user.model');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// GET ALL USERS
router.get('/', async (req, res) => {
  try {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
      res.status(500).json({ success: false });
    }

    res.status(200).json(userList);
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// GET SINGLE USER
router.get('/:userId', async (req, res) => {
  try {
    const id = req.params.userId;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID',
      });
    }

    const user = await User.findById(id).select('-passwordHash');

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'The user with given ID was not found',
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// GET NUMBER OF USERS
router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    if (!userCount) {
      return res.status(500).json({ success: false });
    }

    res.status(200).json({ userCount });
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// CREATE USER
router.post('/', (req, res) => {
  createOrRegisterUser(req, res, 'created');
});

// UPDATE USER
router.put('/:userId', async (req, res) => {
  const id = req.params.userId;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid User ID',
    });
  }

  let update = {};
  let passwordHash = req.body.password;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const isAdmin = req.body.isAdmin;
  const street = req.body.street;
  const apartment = req.body.apartment;
  const city = req.body.city;
  const zip = req.body.zip;
  const country = req.body.country;

  if (name) update = { ...update, name };
  if (email) update = { ...update, email };
  if (passwordHash) {
    passwordHash = bcrypt.hashSync(passwordHash, 10);
    update = { ...update, passwordHash };
  }
  if (phone) update = { ...update, phone };
  if (isAdmin) update = { ...update, isAdmin };
  if (street) update = { ...update, street };
  if (apartment) update = { ...update, apartment };
  if (city) update = { ...update, city };
  if (zip) update = { ...update, zip };
  if (country) update = { ...update, country };

  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
  }).select('-passwordHash');

  if (!user) {
    return res.status(500).json({
      success: false,
      message: 'The user with ID given was not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'The user was updated',
    updatedData: user,
  });
});

// DELETE USER
router.delete('/:userId', async (req, res) => {
  try {
    const id = req.params.userId;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID',
      });
    }

    const user = await User.findByIdAndDelete(id).select('-passwordHash');

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'The user with ID given was not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'The user was deleted',
      deletedData: user,
    });
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// LOGIN USER
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET_KEY;

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      {
        expiresIn: '1h',
      },
    );

    res.status(200).json({
      success: true,
      message: 'user authenticated',
      token: token,
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Email or Password is wrong',
    });
  }
});

// REGISTER USER
router.post('/register', (req, res) => {
  createOrRegisterUser(req, res, 'registered');
});

// USE FOR CREATE USER/REGISTER USER
async function createOrRegisterUser(req, res, message) {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: req.body.password,
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
  });

  user = await user.save();

  if (!user)
    return res.status(500).json({
      success: false,
      message: `Can not be ${message}`,
    });

  res.status(200).json({
    success: true,
    message: `The user was ${message}`,
    data: user,
  });
}

module.exports = router;
