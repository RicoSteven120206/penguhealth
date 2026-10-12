import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const CheckInSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // Tanggal (YYYY-MM-DD, zona waktu pengguna). Satu check-in per hari per pengguna.
    day: { type: String, required: true },
    mood: { type: Number, required: true, min: 1, max: 5 },
    energy: { type: Number, required: true, min: 1, max: 5 },
    sleepHours: { type: Number, required: true, min: 0, max: 24 },
    deadlines: { type: Number, required: true, min: 0, max: 50 },
    note: { type: String, maxlength: 500, default: "" },
  },
  { timestamps: true },
);

CheckInSchema.index({ userId: 1, day: 1 }, { unique: true });

export type CheckInDoc = InferSchemaType<typeof CheckInSchema> & { _id: string };

export const CheckIn: Model<InferSchemaType<typeof CheckInSchema>> =
  (models.CheckIn as Model<InferSchemaType<typeof CheckInSchema>>) || model("CheckIn", CheckInSchema);
