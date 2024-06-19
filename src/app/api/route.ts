import { NextResponse } from "next/server";

// for server health check
export async function GET() {
    return NextResponse.json({
        message: "Server is healthy and running"
    }, {status: 200})
}