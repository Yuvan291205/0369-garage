import { NextResponse } from "next/server";
import { getLiveCars } from "@/lib/seedData";

export async function GET() {
  try {
    const cars = await getLiveCars();
    return NextResponse.json({ success: true, count: cars.length, cars });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
