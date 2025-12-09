import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: Types.ObjectId;
  description: string;
  image: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}