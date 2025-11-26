import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';

/* -------------------------------------------
   Review Schema
-------------------------------------------- */
const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

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
  },
  {
    timestamps: true,
  }
);

/* -------------------------------------------
   Prevent Duplicate Reviews Per Product
-------------------------------------------- */
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

/* -------------------------------------------
   Types
-------------------------------------------- */
export type ReviewType = InferSchemaType<typeof reviewSchema>;
export type ReviewDocument = HydratedDocument<ReviewType>;

/* -------------------------------------------
   Next.js-safe Model Export
-------------------------------------------- */
const Review =
  (models.Review as mongoose.Model<ReviewDocument>) ||
  model<ReviewDocument>('Review', reviewSchema);

export default Review;
