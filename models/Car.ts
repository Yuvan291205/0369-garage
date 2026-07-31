import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICar extends Document {
  carId: string;
  name: string;
  make: string;
  modelName: string;
  year: number;
  type: string;
  powertrain: string;
  power: string;
  vin: string;
  image?: string;
  specs: {
    maxSpeedMph: number;
    maxRpm: number;
    batteryCapacityKw?: number;
    engineDisplacement?: string;
  };
  status: "OPTIMAL" | "ATTENTION NEEDED" | "IN_SERVICE";
  createdAt: Date;
}

const CarSchema = new Schema<ICar>(
  {
    carId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    make: { type: String, required: true },
    modelName: { type: String, required: true },
    year: { type: Number, required: true },
    type: { type: String, required: true },
    powertrain: { type: String, required: true },
    power: { type: String, required: true },
    vin: { type: String, required: true, unique: true },
    image: { type: String },
    specs: {
      maxSpeedMph: { type: Number, default: 200 },
      maxRpm: { type: Number, default: 8500 },
      batteryCapacityKw: { type: Number },
      engineDisplacement: { type: String },
    },
    status: {
      type: String,
      enum: ["OPTIMAL", "ATTENTION NEEDED", "IN_SERVICE"],
      default: "OPTIMAL",
    },
  },
  { timestamps: true }
);

export const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
