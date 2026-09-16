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
    const body = await req.json();
    const {
      rfqId,
      unitPrice,
      shippingCost = 0,
      estimatedDeliveryDays = 14,
      terms,
    } = body;

    const rfq = await prisma.rfq.findUnique({
      where: { id: rfqId },
      include: {
        product: { include: { seller: true } },
        buyer: { include: { user: true } },
      },
    });

    if (!rfq) {
      return NextResponse.json({ error: "RFQ not found" }, { status: 404 });
    }

    const totalAmount = Number(unitPrice) * rfq.quantity + Number(shippingCost);

    const quote = await prisma.quote.create({
      data: {
        rfqId,
        sellerId: rfq.product.sellerId,
        unitPrice: Number(unitPrice),
        shippingCost: Number(shippingCost),
        totalAmount,
        estimatedDeliveryDays: Number(estimatedDeliveryDays),
        terms,
        status: "PENDING",
      },
    });

    // Update RFQ status to QUOTED
    await prisma.rfq.update({
      where: { id: rfqId },
      data: { status: "QUOTED" },
    });

    // Notify Buyer
    await prisma.notification.create({
      data: {
        userId: rfq.buyer.userId,
        title: "Artisan Responded with a Quote!",
        message: `${rfq.product.seller.shopName} offered ₹${unitPrice}/unit for your RFQ on "${rfq.product.title}".`,
        type: "RFQ",
        link: "/buyer/dashboard",
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error: any) {
    console.error("Quote creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit quote" },
      { status: 500 }
    );
  }
}

// PUT: Buyer accepts, rejects, or counter-offers a quote
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quoteId, action, counterPrice, counterNotes } = body;

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        rfq: { include: { product: true, buyer: true } },
        seller: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    let status = "PENDING";
    if (action === "ACCEPT") status = "ACCEPTED";
    if (action === "REJECT") status = "REJECTED";
    if (action === "COUNTER") status = "COUNTERED";

    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status,
        counterPrice: counterPrice ? Number(counterPrice) : quote.counterPrice,
        counterNotes: counterNotes || quote.counterNotes,
      },
    });

    // Update RFQ status
    await prisma.rfq.update({
      where: { id: quote.rfqId },
      data: { status },
    });

    // Notify Seller
    await prisma.notification.create({
      data: {
        userId: quote.seller.userId,
        title: `Buyer ${status} Your Quote`,
        message: `Your quote for ${quote.rfq.product.title} has been ${status.toLowerCase()}${
          counterPrice ? ` with a counter-offer of ₹${counterPrice}/unit.` : "."
        }`,
        type: "RFQ",
        link: "/seller/rfqs",
      },
    });

    return NextResponse.json(updatedQuote);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update quote" },
      { status: 500 }
    );
  }
}
