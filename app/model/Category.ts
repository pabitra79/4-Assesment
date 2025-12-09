import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interface/category.interface"

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate slug before validation
categorySchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model<ICategory>('Category', categorySchema);