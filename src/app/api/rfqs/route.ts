import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    let buyerProfileId = user.buyerProfileId;

    if (!buyerProfileId) {
      const bp = await prisma.buyerProfile.findUnique({
        where: { userId: user.id },
      });
      if (!bp) {
        // Auto-create buyer profile if missing
        const newBp = await prisma.buyerProfile.create({
          data: {
            userId: user.id,
            companyName: user.name || "Individual Buyer",
            buyerType: "Retailer",
          },
        });
        buyerProfileId = newBp.id;
      } else {
        buyerProfileId = bp.id;
      }
    }

    const body = await req.json();
    const {
      productId,
      quantity,
      deliveryLocation,
      targetDate,
      targetBudget,
      customizationNotes,
    } = body;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const rfq = await prisma.rfq.create({
      data: {
        buyerId: buyerProfileId,
        productId,
        quantity: Number(quantity),
        deliveryLocation,
        targetDate: new Date(targetDate),
        targetBudget: targetBudget ? Number(targetBudget) : null,
        customizationNotes,
        status: "PENDING",
      },
    });

    // Notify the Artisan Seller
    await prisma.notification.create({
      data: {
        userId: product.seller.userId,
        title: "New Bulk Quote Request (RFQ)!",
        message: `A buyer requested a quote for ${quantity} units of "${product.title}" delivered to ${deliveryLocation}.`,
        type: "RFQ",
        link: "/seller/rfqs",
      },
    });

    return NextResponse.json(rfq, { status: 201 });
  } catch (error: any) {
    console.error("RFQ creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create RFQ" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    let rfqs = [];

    if (user.role === "SELLER") {
      rfqs = await prisma.rfq.findMany({
        where: { product: { sellerId: user.sellerProfileId } },
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
          buyer: { include: { user: true } },
          quotes: true,
        },
      });
    } else {
      rfqs = await prisma.rfq.findMany({
        where: { buyer: { userId: user.id } },
        orderBy: { createdAt: "desc" },
        include: {
          product: { include: { seller: true } },
          quotes: { include: { seller: true } },
        },
      });
    }

    return NextResponse.json(rfqs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch RFQs" }, { status: 500 });
  }
}
