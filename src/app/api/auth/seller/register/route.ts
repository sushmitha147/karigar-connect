import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      mobile,
      password,
      language = "en",
      shopName,
      craftType,
      category,
      state,
      district,
      experienceYears = 0,
      capacityPerMonth = 50,
      gstin,
      udyamNo,
      panNo,
    } = body;

    if (!name || !mobile || !password || !shopName || !craftType || !category || !state || !district) {
      return NextResponse.json(
        { error: "Please fill all required registration fields." },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.trim();

    // Check if mobile already registered
    const existing = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this mobile number is already registered. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        mobile: cleanMobile,
        passwordHash,
        role: "SELLER",
        language,
        sellerProfile: {
          create: {
            shopName,
            craftType,
            category,
            state,
            district,
            experienceYears: Number(experienceYears) || 0,
            capacityPerMonth: Number(capacityPerMonth) || 50,
            gstin: gstin?.trim() || null,
            udyamNo: udyamNo?.trim() || null,
            panNo: panNo?.trim() || null,
            isVerified: false,
          },
        },
      },
      include: {
        sellerProfile: true,
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to Karigar Connect!",
        message: "Your artisan profile has been created. Start by listing your first product using our 6-step AI Studio wizard.",
        type: "SYSTEM",
        link: "/seller/products/new",
      },
    });

    return NextResponse.json(
      {
        message: "Seller registered successfully",
        userId: user.id,
        sellerProfileId: user.sellerProfile?.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Seller registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register seller account." },
      { status: 500 }
    );
  }
}
