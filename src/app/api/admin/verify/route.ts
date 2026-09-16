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
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden. Admin only." }, { status: 403 });
    }

    const body = await req.json();
    const { sellerId, isVerified, productId, isFlagged } = body;

    if (sellerId !== undefined) {
      const updatedSeller = await prisma.sellerProfile.update({
        where: { id: sellerId },
        data: { isVerified: Boolean(isVerified) },
      });

      // Send notification to seller
      await prisma.notification.create({
        data: {
          userId: updatedSeller.userId,
          title: isVerified ? "Artisan Verification Approved! 🎉" : "Verification Status Updated",
          message: isVerified
            ? "Your artisan profile and craft credentials have been verified by the Karigar Connect team."
            : "Your verification badge has been temporarily put on review.",
          type: "VERIFICATION",
          link: "/seller/dashboard",
        },
      });

      return NextResponse.json({ success: true, seller: updatedSeller });
    }

    if (productId !== undefined) {
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { isFlagged: Boolean(isFlagged) },
      });
      return NextResponse.json({ success: true, product: updatedProduct });
    }

    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
