const express = require('express');
const router = express.Router();
const Category = require('../model/category.model');
const mongoose = require('mongoose');

// GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      return res.status(500).json({ success: false });
    }

    res.status(200).json(categoryList);
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// GET SINGLE CATEGORY
router.get('/:categoryId', async (req, res) => {
  try {
    const id = req.params.categoryId;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid Category ID',
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      res.status(500).json({
        success: false,
        message: 'The category with given ID was not found',
      });
    }

    res.status(200).json(category);
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// GET NUMBER OF CATEGORIES
router.get('/get/count', async (req, res) => {
  try {
    const categoryCount = await Category.countDocuments();

    if (!categoryCount) {
      return res.status(500).json({ success: false });
    }

    res.status(200).json({ categoryCount: categoryCount });
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// CREATE CATEGORY
router.post('/', async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    category = await category.save();

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Cant be created',
      });
    }

    res.status(200).json({
      success: true,
      message: 'The category was created',
      createdData: category,
    });
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// UPDATE CATEGORY
router.put('/:categoryId', async (req, res) => {
  try {
    const id = req.params.categoryId;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(500).json({
        success: false,
        message: 'Invalid Category ID',
      });
    }

    let update = {};
    const name = req.body.name;
    const icon = req.body.icon;
    const color = req.body.color;

    if (name) update = { ...update, name };
    if (icon) update = { ...update, icon };
    if (color) update = { ...update, color };

    const category = await Category.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!category) {
      return res.status(500).json({
        success: false,
        message: 'The category with given ID was not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'The category was updated',
      updatedData: category,
    });
  } catch (err) {
    console.log('ERROR: ', err);
  }
});

// DELETE CATEGORY
router.delete('/:categoryId', async (req, res) => {
  const id = req.params.categoryId;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(500).json({
      success: false,
      message: 'Invalid Category ID',
    });
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'The category with given ID was not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'The category has been deleted.',
    deletedData: category,
  });
});

module.exports = router;
