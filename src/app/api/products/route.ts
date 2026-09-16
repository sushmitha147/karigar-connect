import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const craftType = searchParams.get("craftType");
    const state = searchParams.get("state");
    const search = searchParams.get("search");
    const sellerId = searchParams.get("sellerId");
    const isGiTagged = searchParams.get("isGiTagged");

    const where: any = {};

    if (category && category !== "All") {
      where.category = category;
    }
    if (craftType) {
      where.craftType = { contains: craftType };
    }
    if (sellerId) {
      where.sellerId = sellerId;
    }
    if (isGiTagged === "true") {
      where.isGiTagged = true;
    }
    if (state) {
      where.seller = { state };
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDesc: { contains: search } },
        { craftType: { contains: search } },
        { material: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        seller: {
          include: {
            user: {
              select: { name: true, mobile: true, email: true, avatarUrl: true },
            },
          },
        },
        reviews: true,
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only registered artisans can list products" },
        { status: 403 }
      );
    }

    let sellerProfileId = user.sellerProfileId;

    if (!sellerProfileId) {
      const sp = await prisma.sellerProfile.findUnique({
        where: { userId: user.id },
      });
      if (!sp) {
        return NextResponse.json(
          { error: "Artisan workshop profile not found. Please complete profile setup." },
          { status: 400 }
        );
      }
      sellerProfileId = sp.id;
    }

    const body = await req.json();
    const {
      title,
      shortDesc,
      longDesc,
      category,
      craftType,
      price,
      moq = 5,
      stock = 25,
      images,
      material,
      dimensions,
      weight,
      color,
      origin,
      careInstructions,
      isHandmade = true,
      isGiTagged = false,
      keywords,
      translations,
    } = body;

    if (!title || !shortDesc || !category || !price) {
      return NextResponse.json(
        { error: "Please fill all required product details." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        sellerId: sellerProfileId,
        title,
        shortDesc,
        longDesc: longDesc || shortDesc,
        category,
        craftType: craftType || category,
        price: Number(price),
        moq: Number(moq) || 1,
        stock: Number(stock) || 10,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        material,
        dimensions,
        weight,
        color,
        origin,
        careInstructions,
        isHandmade: Boolean(isHandmade),
        isGiTagged: Boolean(isGiTagged),
        keywords: Array.isArray(keywords) ? keywords.join(", ") : keywords,
        translations: typeof translations === "string" ? translations : JSON.stringify(translations || {}),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product listing" },
      { status: 500 }
    );
  }
}
