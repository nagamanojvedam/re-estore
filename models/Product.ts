import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';

/* -------------------------------------------
   Product Schema
-------------------------------------------- */
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        'Electronics',
        'Clothing',
        'Books',
        'Home & Garden',
        'Sports & Outdoors',
        'Beauty & Personal Care',
        'Automotive',
        'Toys & Games',
        'Health & Wellness',
        'Food & Beverages',
      ],
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      sum: {
        type: Number,
        default: 0,
      },
    },

    specifications: {
      type: Map,
      of: Schema.Types.Mixed, // string | number | object | boolean
      default: {},
    },
  },
  { timestamps: true }
);

/* -------------------------------------------
   Indexes
-------------------------------------------- */
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ owner: 1 });
productSchema.index({ isActive: 1 });

/* -------------------------------------------
   Types Inferred From Schema
-------------------------------------------- */

// Infer all product fields automatically
export type ProductType = InferSchemaType<typeof productSchema>;

// Document type including Mongoose instance methods
export type ProductDocument = HydratedDocument<ProductType>;

/* -------------------------------------------
   Next.js-safe model export
-------------------------------------------- */
const Product =
  (models.Product as mongoose.Model<ProductDocument>) ||
  model<ProductDocument>('Product', productSchema);

export default Product;
