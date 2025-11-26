import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';

/* -------------------------------------------
   Schema
-------------------------------------------- */
const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    expires: {
      type: Date,
      required: true,
    },

    revoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/* -------------------------------------------
   TTL Index (auto delete when expired)
-------------------------------------------- */
refreshTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

/* -------------------------------------------
   Types inferred from schema
-------------------------------------------- */
export type RefreshTokenType = InferSchemaType<typeof refreshTokenSchema>;

export type RefreshTokenDocument = HydratedDocument<RefreshTokenType>;

/* -------------------------------------------
   Next.js-safe model export
-------------------------------------------- */
const RefreshToken =
  (models.RefreshToken as mongoose.Model<RefreshTokenDocument>) ||
  model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);

export default RefreshToken;
