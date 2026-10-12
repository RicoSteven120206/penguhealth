import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const LEVELS = ["rendah", "sedang", "tinggi", "sangat_tinggi"];
const DIMS = ["personal", "studi", "teman", "dosen"];

const DimensionScoreSchema = new Schema(
  {
    score: { type: Number, default: null },
    level: { type: String, enum: [...LEVELS, null], default: null },
    answered: Number,
    total: Number,
  },
  { _id: false },
);

const AssessmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    instrument: { type: String, default: "CBI-SV" },
    // Jawaban mentah: { "1": 75, "2": 50, ... } agar skor bisa dihitung ulang bila aturan berubah.
    answers: { type: Map, of: Number, required: true },
    dimensions: {
      personal: DimensionScoreSchema,
      studi: DimensionScoreSchema,
      teman: DimensionScoreSchema,
      dosen: DimensionScoreSchema,
    },
    total: { type: Number, default: null },
    totalLevel: { type: String, enum: [...LEVELS, null], default: null },
    dominant: { type: String, enum: [...DIMS, null], default: null },
    needsReferral: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type AssessmentDoc = InferSchemaType<typeof AssessmentSchema> & { _id: string };

export const Assessment: Model<InferSchemaType<typeof AssessmentSchema>> =
  (models.Assessment as Model<InferSchemaType<typeof AssessmentSchema>>) ||
  model("Assessment", AssessmentSchema);
