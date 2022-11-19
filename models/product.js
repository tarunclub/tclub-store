const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [120, 'Product name should be less than 120 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      maxlength: [6, 'Product name should be less than 6 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    photos: [
      {
        id: {
          type: String,
          required: true,
        },
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [
        true,
        'Please select category from electronics, clothing, entertainment, footwear, software',
      ],
      enum: {
        values: [
          'electronics',
          'clothing',
          'entertainment',
          'footwear',
          'software',
        ],
        message:
          'Please select category only from electronics, clothing, entertainment, footwear, software',
      },
    },
    stock: {
      type: Number,
      required: [true, 'please add a number in stock'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand for clothing'],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
