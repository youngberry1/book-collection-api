import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview {
  name: string;
  body: string;
}

export interface IBook extends Document {
  title: string;
  author: string;
  pages: number;
  rating: number;
  genres: string[];
  reviews?: IReview[];
}

const ReviewSchema = new Schema<IReview>({
  name: { type: String, required: true },
  body: { type: String, required: true },
});

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  pages: { type: Number, required: true, min: 1 },
  rating: { type: Number, required: true, min: 0, max: 10 },
  genres: { type: [String], required: true },
  reviews: { type: [ReviewSchema], required: false, default: [] },
}, {
  timestamps: true
});

/** Book Model Definition */
const Book: Model<IBook> = mongoose.model<IBook>('Book', BookSchema);

export default Book;
