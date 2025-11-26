import mongoose, { Schema, model, models, InferSchemaType, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

/* -------------------------------------------
   Wishlist Subdocument Schema
-------------------------------------------- */
const wishlistSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* -------------------------------------------
   User Schema
-------------------------------------------- */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, lowercase: true, trim: true },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isEmailVerified: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },

    wishlist: [wishlistSchema],

    passwordChangedAt: { type: Date },

    resetToken: { type: String },

    resetTokenExpires: { type: Date },
  },
  { timestamps: true }
);

/* -------------------------------------------
   Indexes
-------------------------------------------- */
userSchema.index({ email: 1 }, { unique: true });

/* -------------------------------------------
   Types Inferred From Schema
-------------------------------------------- */
export type UserType = InferSchemaType<typeof userSchema>;

/**
 * Methods you want to add to the document
 */
export interface UserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

/**
 * Final Document Type used everywhere
 */
export type UserDocument = HydratedDocument<UserType, UserMethods>;

/* -------------------------------------------
   Pre-save Hook (Hash Password)
-------------------------------------------- */
userSchema.pre('save', async function (this: UserDocument) {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    // So JWT iat < passwordChangedAt after password change
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

/* -------------------------------------------
   Instance Methods
-------------------------------------------- */
userSchema.methods.isPasswordMatch = async function (this: UserDocument, inputPassword: string) {
  return bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (this: UserDocument, JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

/* -------------------------------------------
   Safe Next.js Model Export
-------------------------------------------- */
const User =
  (models.User as mongoose.Model<UserDocument>) || model<UserDocument>('User', userSchema);

export default User;
