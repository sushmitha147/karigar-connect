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
      productId,
      quantity,
      shippingAddress,
      paymentMethod = "RAZORPAY", // RAZORPAY, UPI, COD
      rfqId,
    } = body;

    if (!productId || !quantity || !shippingAddress) {
      return NextResponse.json(
        { error: "Product, quantity, and shipping address are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Insufficient stock. Only ${product.stock} units currently available.` },
        { status: 400 }
      );
    }

    const totalAmount = product.price * Number(quantity);
    const orderNumber = `KC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create order and decrement inventory atomically in transaction
    const [order, updatedProduct] = await prisma.$transaction([
      prisma.order.create({
        data: {
          orderNumber,
          buyerId: user.id,
          sellerId: product.sellerId,
          productId: product.id,
          quantity: Number(quantity),
          totalAmount,
          paymentMethod,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
          orderStatus: "PROCESSING",
          shippingAddress,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          stock: { decrement: Number(quantity) },
        },
      }),
    ]);

    // If RFQ was associated, mark as ACCEPTED
    if (rfqId) {
      await prisma.rfq.update({
        where: { id: rfqId },
        data: { status: "ACCEPTED" },
      });
    }

    // Create Notification for Artisan Seller
    await prisma.notification.create({
      data: {
        userId: product.seller.userId,
        title: "New Wholesale Order Received!",
        message: `${user.name} placed order ${orderNumber} for ${quantity} pcs of "${product.title}" (₹${totalAmount.toLocaleString('en-IN')}).`,
        type: "ORDER",
        link: "/seller/orders",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order" },
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
    let orders = [];

    if (user.role === "SELLER" && user.sellerProfileId) {
      orders = await prisma.order.findMany({
        where: { sellerId: user.sellerProfileId },
        orderBy: { createdAt: "desc" },
        include: { product: true, buyer: true },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { buyerId: user.id },
        orderBy: { createdAt: "desc" },
        include: { product: { include: { seller: true } } },
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
