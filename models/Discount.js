import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "fixed"], default: "percent" },
    value: { type: Number, required: true, min: 1 },
    maxUses: { type: Number, default: 0 }, // صفر یعنی نامحدود
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null }, // null یعنی بدون انقضا
    isActive: { type: Boolean, default: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null }, // null یعنی همه دوره‌ها
  },
  { timestamps: true }
);

export default mongoose.models.Discount || mongoose.model("Discount", DiscountSchema);