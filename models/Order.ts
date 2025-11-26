import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';

/* ---------------------------------------------------
   Order Item Sub-schema
---------------------------------------------------- */
const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

/* ---------------------------------------------------
   Main Order Schema
---------------------------------------------------- */
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    items: [orderItemSchema],

    subTotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

/* ---------------------------------------------------
   Pre-save Order Number Generator
---------------------------------------------------- */
orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
  }
});

/* ---------------------------------------------------
   Indexes
---------------------------------------------------- */
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });

/* ---------------------------------------------------
   Types
---------------------------------------------------- */
export type OrderType = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<OrderType>;

/* ---------------------------------------------------
   Safe Model Export for Next.js Hot Reloading
---------------------------------------------------- */
const Order =
  (models.Order as mongoose.Model<OrderDocument>) || model<OrderDocument>('Order', orderSchema);

export default Order;
