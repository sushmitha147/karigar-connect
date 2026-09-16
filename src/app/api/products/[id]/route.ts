import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        seller: {
          include: {
            user: {
              select: { name: true, mobile: true, email: true, avatarUrl: true },
            },
          },
        },
        reviews: {
          include: {
            buyer: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await req.json();

    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Ensure only the seller or admin can edit
    if (user.role !== "ADMIN" && existing.sellerId !== user.sellerProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        title: body.title !== undefined ? body.title : existing.title,
        shortDesc: body.shortDesc !== undefined ? body.shortDesc : existing.shortDesc,
        longDesc: body.longDesc !== undefined ? body.longDesc : existing.longDesc,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        moq: body.moq !== undefined ? Number(body.moq) : existing.moq,
        stock: body.stock !== undefined ? Number(body.stock) : existing.stock,
        isHandmade: body.isHandmade !== undefined ? Boolean(body.isHandmade) : existing.isHandmade,
        isGiTagged: body.isGiTagged !== undefined ? Boolean(body.isGiTagged) : existing.isGiTagged,
        isFlagged: body.isFlagged !== undefined ? Boolean(body.isFlagged) : existing.isFlagged,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN" && existing.sellerId !== user.sellerProfileId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
