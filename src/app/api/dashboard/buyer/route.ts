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
    const buyer = await prisma.buyerProfile.findFirst({
      where: { userId: user.id },
      include: {
        rfqs: { include: { product: true, quotes: true } },
      },
    });

    const orders = await prisma.order.findMany({
      where: { buyerId: user.id },
      include: { product: true },
    });

    const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      buyer,
      stats: {
        totalOrders: orders.length,
        totalRfqs: buyer?.rfqs.length || 0,
        totalSpend,
      },
      orders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
