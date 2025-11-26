import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';

/* -------------------------------------------
   UserProduct Schema
-------------------------------------------- */
const userProductSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },

    lastPurchasedAt: {
      type: Date,
      default: Date.now,
    },

    purchaseCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

/* -------------------------------------------
   Prevent Multiple Entries (One Product/User Pair)
-------------------------------------------- */
userProductSchema.index({ user: 1, product: 1 }, { unique: true });

/* -------------------------------------------
   Types
-------------------------------------------- */
export type UserProductType = InferSchemaType<typeof userProductSchema>;
export type UserProductDocument = HydratedDocument<UserProductType>;

/* -------------------------------------------
   Next.js-safe Model Export
-------------------------------------------- */
const UserProduct =
  (models.UserProduct as mongoose.Model<UserProductDocument>) ||
  model<UserProductDocument>('UserProduct', userProductSchema);

export default UserProduct;
