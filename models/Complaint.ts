import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComplaint extends Document {
  complaintId: string;
  carId: string;
  carName: string;
  driverName: string;
  code: string;
  symptom: string;
  severity: "CRITICAL" | "WARNING" | "MILD";
  solution: {
    title: string;
    rootCause: string;
    fixSteps: string[];
    estimatedCost: string;
    laborTime: string;
    partsRequired: string[];
    confidenceScore: number;
  };
  status: "LOGGED" | "DIAGNOSED" | "IN_REPAIR" | "RESOLVED";
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complaintId: { type: String, required: true, unique: true },
    carId: { type: String, required: true },
    carName: { type: String, required: true },
    driverName: { type: String, default: "Driver / Technician" },
    code: { type: String, required: true },
    symptom: { type: String, required: true },
    severity: {
      type: String,
      enum: ["CRITICAL", "WARNING", "MILD"],
      default: "WARNING",
    },
    solution: {
      title: { type: String, required: true },
      rootCause: { type: String, required: true },
      fixSteps: [{ type: String }],
      estimatedCost: { type: String, required: true },
      laborTime: { type: String, required: true },
      partsRequired: [{ type: String }],
      confidenceScore: { type: Number, default: 98.5 },
    },
    status: {
      type: String,
      enum: ["LOGGED", "DIAGNOSED", "IN_REPAIR", "RESOLVED"],
      default: "LOGGED",
    },
  },
  { timestamps: true }
);

export const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);
