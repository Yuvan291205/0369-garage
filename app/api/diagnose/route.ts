import { NextResponse } from "next/server";
import { logCarComplaint } from "@/lib/seedData";

export async function POST(req: Request) {
  try {
    const {
      carMake = "Generic Make",
      carModel = "Generic Model",
      carYear = 2026,
      driverName = "Guest Driver",
      query,
    } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Diagnostic symptom or problem description is required" },
        { status: 400 }
      );
    }

    const complaintRecord = await logCarComplaint({
      carMake,
      carModel,
      carYear,
      driverName,
      query,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      complaintId: complaintRecord.complaintId,
      vehicleModel: complaintRecord.carName,
      diagnosis: complaintRecord.solution,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Diagnostic scan failed to process", details: error.message },
      { status: 500 }
    );
  }
}
