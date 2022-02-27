const express = require('express');
const router = express.Router();
const Order = require('../model/order.model');
const mongoose = require('mongoose');
const OrderItem = require('../model/order-item.model');

// GET ALL ORDERS
router.get('/', async (req, res) => {
  const ordersList = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  if (!ordersList) {
    res.status(500).json({ success: false });
  }

  res.status(200).json(ordersList);
});

// GET SINGLE ORDER
router.get('/:orderId', async (req, res) => {
  const id = req.params.orderId;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Order ID',
    });
  }

  const order = await Order.findById(id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    });

  if (!order) {
    return res.status(500).json({
      success: false,
      message: 'The order with given ID was not found',
    });
  }

  res.status(200).json(order);
});

// GET NUMBER OF ORDERS
router.get('/get/count', async (req, res) => {
  const orderCount = await Order.countDocuments();

  if (!orderCount) {
    return res.status(500).json({ success: false });
  }

  res.status(200).json({ orderCount });
});

// GET ORDER BY USER
router.get('/get/userorers/:userId', async (req, res) => {
  const userId = req.params.userId;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid User ID',
    });
  }

  const orderList = await Order.find({ user: userId })
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
    .sort({ createdAt: -1 });

  if (!orderList) {
    return res.status(500).json({ success: false });
  }

  res.status(200).json(orderList);
});

// CREATE ORDER
router.post('/', async (req, res) => {
  const orderItemsIds = await Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem.id;
    }),
  );

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price',
      );

      console.log(orderItem);
      if (!orderItem) {
        res.status(500).json({
          success: false,
          message: 'The orderItem Id was not found',
        });
      }
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    }),
  );

  const totalPrice = totalPrices.reduce((total, value) => total + value, 0);

  let order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  order = await order.save();

  if (!order)
    return res.status(500).json({
      success: false,
      message: 'Cant be created.',
    });

  res.status(200).json({
    success: true,
    message: 'The order was created',
    createdData: order,
  });
});

// UPDATE STATUS OF ORDER
router.put('/:orderId', async (req, res) => {
  const id = req.params.orderId;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({
      success: false,
      message: 'Invalid order ID',
    });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { status: req.body.status },
    { new: true },
  );

  if (!order) {
    res.status(500).json({
      success: false,
      message: 'The order with ID was not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'The order was updated',
    updatedData: order,
  });
});

// DELETE ORDER
router.delete('/:orderId', async (req, res) => {
  const id = req.params.orderId;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Order ID',
    });
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) {
    return res.status(500).json({
      success: false,
      message: 'The order with ID given was not found',
    });
  }

  await order.orderItems.map(async (item) => {
    await OrderItem.findByIdAndDelete(item);
  });

  res.status(200).json({
    success: true,
    message: 'The order was deleted',
    deletedData: order,
  });
});

// GET SUM OF TOTALPRICE
router.get('/get/totalsales', async (req, res) => {
  const totalsales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
  ]);

  if (!totalsales) {
    return res
      .status(500)
      .json({ success: false, message: 'The order sale cannot be generated' });
  }

  res.status(200).json({ totalsales: totalsales.shift().totalsales });
});

module.exports = router;
