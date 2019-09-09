const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const productModel = require('../models/product');

router.get('/', function (req, res, next) {
  return productModel.find({})
    .lean()
    .exec()
    .then(products => res.render('index',
      {
        title: 'NodeJS Shopping Cart',
        products: products
      })
    )
    .catch(err => res.status(500).render('error', { message: err.message, err }));
});

router.get('/add/:id', function(req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  return productModel.findOne({ _id: mongoose.Types.ObjectId(productId) })
    .lean()
    .exec()
    .then(product => {
      cart.add(product, productId);
      req.session.cart = cart;
      res.redirect('/');
    })
    .catch(err => res.status(500).render('error', { message: err.message, err }));
});

router.get('/cart', function(req, res, next) {
  if (!req.session.cart) {
    return res.render('cart', {
      products: null
    });
  }
  const cart = new Cart(req.session.cart);
  res.render('cart', {
    title: 'NodeJS Shopping Cart',
    products: cart.getItems(),
    totalPrice: cart.totalPrice,
    displayTotalPrice: cart.displayTotalPrice
  });
});

router.get('/remove/:id', function(req, res, next) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

module.exports = router;
