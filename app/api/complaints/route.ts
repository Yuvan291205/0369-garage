import { NextResponse } from "next/server";
import { getLiveComplaints, logCarComplaint } from "@/lib/seedData";

export async function GET() {
  try {
    const complaints = await getLiveComplaints();
    return NextResponse.json({ success: true, count: complaints.length, complaints });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { carMake = "Custom Make", carModel = "Custom Model", carYear = 2026, driverName, query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "query / symptom description is required" },
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
      message: "Complaint logged to MongoDB and vehicle diagnostic solution generated successfully",
      complaint: complaintRecord,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
