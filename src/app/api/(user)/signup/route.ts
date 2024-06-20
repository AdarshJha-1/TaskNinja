import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { ApiResponse } from "@/types/ApiResponse";
import { SignUp } from "@/types/SignUp";
import { signUpSchema } from "@/schemas/signUpSchema";
import bcrypt from "bcryptjs";
export async function POST(request: NextRequest) {
  try {
    const { username, email, password, profileImageUrl }: SignUp =
      await request.json();
    const { success, data } = signUpSchema.safeParse({
      username,
      email,
      password,
      profileImageUrl,
    });
    if (!success) {
      return NextResponse.json<ApiResponse>(
        {
          message: "All fields are required",
          success: false,
        },
        { status: 400 }
      );
    }
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          message: "User already exists",
          success: false,
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const newUser = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    if(!newUser){
        return NextResponse.json<ApiResponse>(
            {
              message: "Error while signing up",
              success: false,
            },
            { status: 500 }
          );
    }
    return NextResponse.json<ApiResponse>(
        {
          message: "Signup Successfully",
          success: true,
        },
        { status: 200 }
      );
  } catch (error: any) {
    console.log("Signup error :: ", error.message);
    return NextResponse.json<ApiResponse>(
      {
        message: "Error while signing up",
        success: false,
      },
      { status: 500 }
    );
  }
}
