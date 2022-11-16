const Product = require("../models/product");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");

exports.addProduct = async (req, res, next) => {
  try {
    // images
    let images = [];

    if (!req.files) {
      return next(new Error("Images are required"));
    }

    if (req.files) {
      for (let index = 0; index < req.files.photos.length; index++) {
        let result = await cloudinary.v2.uploader.upload(
          req.files.photos[index].tempFilePath,
          {
            folder: "products",
          }
        );
        images.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    req.body.photos = images;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = 6;

    const totalCountProduct = await Product.countDocuments();

    const productObj = new WhereClause(Product.find(), req.query)
      .search()
      .filter();

    let products = await productObj.base;
    const filterProductNumber = products.length;

    productObj.pager(resultPerPage);
    products = await productObj.base.clone();

    res.status(200).json({
      success: true,
      products,
      filterProductNumber,
      totalCountProduct,
    });
  } catch (error) {
    return next(new Error(error.message));
  }
};
