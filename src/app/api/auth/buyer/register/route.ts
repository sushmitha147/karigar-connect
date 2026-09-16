import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      companyName,
      mobile,
      email,
      password,
      buyerType,
      city,
      state,
      gstin,
    } = body;

    if (!name || !companyName || !mobile || !email || !password || !buyerType) {
      return NextResponse.json(
        { error: "Please provide all required registration fields." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if mobile or email already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ mobile: cleanMobile }, { email: cleanEmail }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this mobile number or email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        mobile: cleanMobile,
        passwordHash,
        role: "BUYER",
        language: "en",
        buyerProfile: {
          create: {
            companyName,
            buyerType,
            city: city?.trim() || null,
            state: state?.trim() || null,
            gstin: gstin?.trim() || null,
          },
        },
      },
      include: {
        buyerProfile: true,
      },
    });

    return NextResponse.json(
      {
        message: "Buyer registered successfully",
        userId: user.id,
        buyerProfileId: user.buyerProfile?.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Buyer registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register buyer account." },
      { status: 500 }
    );
  }
}
