import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';

/* -----------------------------------------------------
   Schema Definition
------------------------------------------------------ */
const messageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
      trim: true,
    },

    isReplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

/* -----------------------------------------------------
   Type Inference from Schema
------------------------------------------------------ */
export type MessageType = InferSchemaType<typeof messageSchema>;
export type MessageDocument = HydratedDocument<MessageType>;

/* -----------------------------------------------------
   Safe Model Export for Next.js Hot Reloading
------------------------------------------------------ */
const Message =
  (models.Message as mongoose.Model<MessageDocument>) ||
  model<MessageDocument>('Message', messageSchema);

export default Message;
