// models/Embedding.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IEmbedding extends Document {
  text: string;
  embedding: number[];
}

const EmbeddingSchema = new Schema<IEmbedding>({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true }, // an array of floats
});

export default mongoose.models.Embedding ||
  mongoose.model<IEmbedding>("Embedding", EmbeddingSchema);
