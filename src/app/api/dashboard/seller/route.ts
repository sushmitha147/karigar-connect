import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const seller = await prisma.sellerProfile.findFirst({
      where: { userId: user.id },
      include: {
        products: true,
        orders: { include: { buyer: true, product: true } },
        quotes: { include: { rfq: { include: { buyer: true, product: true } } } },
      },
    });

    if (!seller) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    const totalRevenue = seller.orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pendingOrders = seller.orders.filter((o) => o.orderStatus === "PROCESSING").length;

    return NextResponse.json({
      seller,
      stats: {
        totalProducts: seller.products.length,
        totalOrders: seller.orders.length,
        pendingOrders,
        totalRevenue,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
