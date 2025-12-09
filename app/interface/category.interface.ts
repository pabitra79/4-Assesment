import { Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
