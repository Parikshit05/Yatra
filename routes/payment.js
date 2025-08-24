const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/order', async (req, res) => {
    const { bookingData } = req.body;

    const amount = bookingData.price;

  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency: 'INR',
    receipt: 'receipt_order_74394',
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

router.post('/success', (req, res) => {
  res.render('payment/success.ejs', { payment: req.body });
});

module.exports = router;
