import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    university: { type: String, trim: true, maxlength: 120 },
    semester: { type: Number, min: 1, max: 14 },
    // Persetujuan penggunaan data (informed consent). Null = belum menyetujui.
    consentAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };

export const User: Model<InferSchemaType<typeof UserSchema>> =
  (models.User as Model<InferSchemaType<typeof UserSchema>>) || model("User", UserSchema);
