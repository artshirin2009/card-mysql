var express = require("express");
var router = express.Router();

var csrf = require("csurf");
var csrfProtection = csrf({
  cookie: true
});


var productsQuery = "SELECT * FROM airshop";

var usersQuery = "SELECT * FROM users";
var Cart = require("../models/cart");

var additionalFunc = require("../config/additionalFunc")

router.use(csrfProtection);

/* GET home page. */
router.get("/", additionalFunc.getCategory, function (req, res, next) {
  req.session.oldUrl = req.url
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(productsQuery, [], function (err, results) {
      if (err) return next(err);
      res.render("shop/index", {
        title: "Shop",
        products: results,
        categories: true
      });
    });
  });
});

/**Adding products to cart */
router.get("/add-to-cart/:id", function (req, res, next) {
  var urlSaved = req.session.oldUrl
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var selectProductFromDb = `SELECT * FROM airshop WHERE product_id = '${productId}'`;
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(selectProductFromDb, [], function (err, product) {
      if (err) return next(err);
      cart.add(product[0], product[0].product_id);
      req.session.cart = cart;
      res.redirect(urlSaved);
    });
  });
});
/**End Adding products to cart */

/**Shopping cart */
router.get("/cart", additionalFunc.getCategory, function (req, res, next) {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  if (cart.totalQty < 1) {
    res.redirect("/");
  } else {
    req.getConnection(function (err, connection) {
      if (err) return next(err);
      connection.query(productsQuery, [], function (err, results) {
        if (err) return next(err);
        res.render("shop/cart", {
          cart: cart.generateArray(),
          categories: true
        });
      });
    });
  }
});
/**End Shopping cart */

/**Adding and removing products from cart-page */
router.get("/cart/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var selectProductFromDb = `SELECT * FROM airshop WHERE product_id = '${productId}'`;
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(selectProductFromDb, [], function (err, product) {
      if (err) return next(err);
      cart.add(product[0], product[0].product_id);
      req.session.cart = cart;
      res.redirect("/cart");
    });
  });
});
router.get("/cart/remove-one-from-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var selectProductFromDb = `SELECT * FROM airshop WHERE product_id = '${productId}'`;
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(selectProductFromDb, [], function (err, product) {
      if (err) return next(err);
      cart.remove(product[0], product[0].product_id);
      req.session.cart = cart;
      res.redirect("/cart");
    });
  });
});
/**End Adding and removing products from cart-page */

/**Shopping cart */
router.get("/details/:id", additionalFunc.getCategory, function (req, res, next) {
  var productId = req.params.id;
  var selectProductFromDb = `SELECT * FROM airshop WHERE product_id = '${productId}'`;
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(selectProductFromDb, [], function (err, product) {
      if (err) return next(err);
      res.render("shop/product", {
        product: product[0],
        categories: true
      });
    });
  });
});

/**End Shopping cart */

/**Adding product from details-page */
router.get("/details/add-to-cart/:id", function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var selectProductFromDb = `SELECT * FROM airshop WHERE product_id = '${productId}'`;
  req.getConnection(function (err, connection) {
    if (err) return next(err);
    connection.query(selectProductFromDb, [], function (err, product) {
      if (err) return next(err);
      cart.add(product[0], product[0].product_id);
      req.session.cart = cart;
      res.redirect(`/details/${productId}`);
    });
  });
});
/**End Adding product from details-page */

/** Get one category route */
router.get("/category-:parent_cat_name/:cat_name", additionalFunc.getCategory, function (req, res, next) {
  req.session.oldUrl = req.url
  var catName = req.params.cat_name;
  var selectedCategoryId, selectedCategoryName;
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query(`SELECT id, name FROM categories WHERE alias='${catName}'`, function (err, results) {
      selectedCategoryId = results[0].id;
      selectedCategoryName = results[0].name;
      req.getConnection((err, connection) => {
        if (err) return next(err);
        var query = `SELECT product_name, product_s_desc, image, price, product_id FROM airshop WHERE  airshop.cat_id=${selectedCategoryId}`;
        connection.query(query, function (err, products) {
          if (err) return next(err);
          products = JSON.parse(JSON.stringify(products));
          res.render('shop/index', {
            title: selectedCategoryName,
            categories: true,
            products: products
          });
        });
      });
    })
  })
})
/**End Get one category route */


/**Get all Users */
module.exports = router;