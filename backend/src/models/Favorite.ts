import mongoose, { Document, Schema } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index(
  { user: 1, vehicle: 1 },
  { unique: true }
);

const Favorite = mongoose.model<IFavorite>(
  "Favorite",
  favoriteSchema
);

export default Favorite;