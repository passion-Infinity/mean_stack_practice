const express = require('express');
const router = express.Router();
const Product = require('../model/product.model');
const Category = require('../model/category.model');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

// CONFIG UPLOAD FILE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image');

    if (isValid) {
      uploadError = null;
    }

    cb(uploadError, 'src/public/uploads');
  },
  filename: function (req, file, cb) {
    const fileName = `prod-${file.originalname.split(/\s+/).join('_')}`;
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(',') };
  }

  const productList = await Product.find(filter).populate('category');

  if (!productList) {
    return res.status(500).json({ success: false });
  }

  res.status(200).json(productList);
});

// GET SINGLE PRODUCT
router.get('/:productId', async (req, res) => {
  const id = req.params.productId;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID',
    });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'The product with given ID was not found',
    });
  }

  res.status(200).json(product);
});

// GET NUMBER OF PRODUCTS
router.get('/get/count', async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    return res.status(500).json({ success: false });
  }

  res.status(200).json({ productCount });
});

// CREATE NEW PRODUCT
router.post('/', uploadOptions.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image in the request',
    });
  }

  const categoryId = await Category.findById(req.body.category);
  if (!categoryId) {
    return res.status(404).json({
      success: false,
      message: 'Invalid category',
    });
  }

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}/${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: categoryId,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numberReviews: req.body.numberReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product)
    return res.status(500).json({
      success: false,
      message: 'Cant be created.',
    });

  res.status(200).json({
    success: true,
    message: 'The product was created',
    createdData: product,
  });
});

/**  UPDATE PRODUCT **/
router.put('/:productId', uploadOptions.single('image'), async (req, res) => {
  const produtId = req.params.productId;

  //Check validation of ObjectId
  if (!mongoose.isValidObjectId(produtId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID',
    });
  }

  //Find product with given ID
  const product = await Product.findById(produtId);
  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'The product with given ID was not found',
    });
  }

  //Check existence of category on Categories Table
  const categoryId = await Category.findById(req.body.category);
  if (!categoryId) {
    return res.status(404).json({
      success: false,
      message: 'Invalid category',
    });
  }

  const file = req.file;
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
  let imagePath;

  if (file) {
    imagePath = `${basePath}/${file.filename}`;
  } else {
    imagePath = product.image;
  }

  let update = {};
  const name = req.body.name;
  const description = req.body.description;
  const richDescription = req.body.richDescription;
  const image = imagePath;
  const brand = req.body.brand;
  const price = req.body.price;
  const category = categoryId;
  const countInStock = req.body.countInStock;
  const rating = req.body.rating;
  const numberReviews = req.body.numberReview;
  const isFeatured = req.body.isFeatured;

  if (name) update = { ...update, name };
  if (description) update = { ...update, description };
  if (richDescription) update = { ...update, richDescription };
  if (image) update = { ...update, image };
  if (brand) update = { ...update, brand };
  if (price) update = { ...update, price };
  if (category) update = { ...update, category };
  if (countInStock) update = { ...update, countInStock };
  if (rating) update = { ...update, rating };
  if (numberReviews) update = { ...update, numberReviews };

  update = { ...update, isFeatured };

  const updatedProduct = await Product.findByIdAndUpdate(produtId, update, {
    new: true,
  });

  if (!updatedProduct) {
    return res.status(500).json({
      success: false,
      message: 'The product with ID given was not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'The product was updated',
    updatedData: updatedProduct,
  });
});

// DELETE PRODUCT
router.delete('/:productId', async (req, res) => {
  const id = req.params.productId;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Product ID',
    });
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(500).json({
      success: false,
      message: 'The product with ID given was not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'The product was deleted',
    deletedData: product,
  });
});

// UPDATE GALLERY IMAGES
router.put(
  '/gallery-images/:productId',
  uploadOptions.array('images', 20),
  async (req, res) => {
    const produtId = req.params.productId;

    if (!mongoose.isValidObjectId(produtId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Product ID',
      });
    }

    const files = req.files;
    let imagesPath = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;

    if (files) {
      files.map((file) => {
        imagesPath.push(`${basePath}/${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      produtId,
      { images: imagesPath },
      {
        new: true,
      },
    );

    if (!product) {
      return res.status(500).json({
        success: false,
        message: 'The product with ID given was not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'The product was updated',
      updatedData: product,
    });
  },
);

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
