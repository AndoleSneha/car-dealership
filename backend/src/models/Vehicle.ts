import mongoose, { Schema } from "mongoose";

export interface IVehicle {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    make: {
      type: String,
      required: true,
      trim: true
    },

    model: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Vehicle = mongoose.model<IVehicle>(
  "Vehicle",
  vehicleSchema
);

export default Vehicle;