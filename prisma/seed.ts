import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Karigar Connect database seed...");

  // Clear demo data for idempotent seeds
  await prisma.notification.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.rfq.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});

  const passwordHash = await bcrypt.hash("Seller@123", 10);
  const buyerPasswordHash = await bcrypt.hash("Buyer@123", 10);
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);

  // 1. Admin User
  const adminUser = await prisma.user.upsert({
    where: { mobile: "9876543212" },
    update: {},
    create: {
      email: "admin@karigar.com",
      mobile: "9876543212",
      name: "Karigar Admin Team",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      language: "en",
    },
  });

  // 2. Demo Buyer User (CraftBoutique Delhi)
  const buyerUser = await prisma.user.upsert({
    where: { mobile: "9876543211" },
    update: {},
    create: {
      email: "buyer@karigar.com",
      mobile: "9876543211",
      name: "Rohit Verma",
      passwordHash: buyerPasswordHash,
      role: "BUYER",
      language: "en",
      buyerProfile: {
        create: {
          companyName: "Virasat Luxury Boutiques & Exports",
          buyerType: "Boutique",
          city: "New Delhi",
          state: "Delhi",
          gstin: "07AAAAA0000A1Z5",
        },
      },
    },
  });

  // 3. Demo Seller 1: Lakshmi Handlooms (Pochampally Ikat, Telangana)
  const seller1User = await prisma.user.upsert({
    where: { mobile: "9876543210" },
    update: {},
    create: {
      email: "seller@karigar.com",
      mobile: "9876543210",
      name: "Lakshmi Devamma",
      passwordHash: passwordHash,
      role: "SELLER",
      language: "te",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      sellerProfile: {
        create: {
          shopName: "Lakshmi Heritage Handlooms",
          craftType: "Pochampally Ikat",
          category: "Handloom",
          state: "Telangana",
          district: "Yadadri Bhuvanagiri",
          experienceYears: 24,
          capacityPerMonth: 60,
          gstin: "36ABCDE1234F1Z5",
          udyamNo: "UDYAM-TS-01-0012345",
          isVerified: true,
          bio: "Master Weaver recognized with the State Heritage Artisan Award. Continuing a 4-generation tradition of authentic Double Ikat handloom weaving in Bhoodan Pochampally village.",
          bannerImage: "https://images.unsplash.com/photo-1606744888344-493238955de0?w=1200&q=80",
        },
      },
    },
    include: { sellerProfile: true },
  });

  // 4. Demo Seller 2: Srinivasa Woodcraft (Etikoppaka, Andhra Pradesh)
  const seller2User = await prisma.user.upsert({
    where: { mobile: "9876543214" },
    update: {},
    create: {
      email: "srinivasa@karigar.com",
      mobile: "9876543214",
      name: "Srinivasa Rao",
      passwordHash: passwordHash,
      role: "SELLER",
      language: "te",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
      sellerProfile: {
        create: {
          shopName: "Srinivasa Etikoppaka Wooden Toy Craft",
          craftType: "Etikoppaka Lacquer Toys",
          category: "Woodcraft",
          state: "Andhra Pradesh",
          district: "Visakhapatnam",
          experienceYears: 18,
          capacityPerMonth: 250,
          gstin: "37ABCDE5678G1Z2",
          udyamNo: "UDYAM-AP-02-0054321",
          isVerified: true,
          bio: "Crafting GI-tagged non-toxic wooden toys turned on hand-lathes using soft Ankudu wood and colored exclusively with natural vegetable seed dyes and organic lac.",
        },
      },
    },
    include: { sellerProfile: true },
  });

  // 5. Demo Seller 3: Blue Art Pottery (Jaipur, Rajasthan)
  const seller3User = await prisma.user.upsert({
    where: { mobile: "9876543215" },
    update: {},
    create: {
      email: "jaipurcrafts@karigar.com",
      mobile: "9876543215",
      name: "Ramswaroop Prajapati",
      passwordHash: passwordHash,
      role: "SELLER",
      language: "hi",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      sellerProfile: {
        create: {
          shopName: "Jaipur Blue Art Pottery Studio",
          craftType: "Jaipur Blue Pottery",
          category: "Pottery",
          state: "Rajasthan",
          district: "Jaipur",
          experienceYears: 30,
          capacityPerMonth: 120,
          isVerified: true,
          bio: "Turquoise and cobalt Egyptian glaze craft brought to Jaipur in the 19th century. Free of clay, crafted purely from quartz stone powder and Multani Mitti.",
        },
      },
    },
    include: { sellerProfile: true },
  });

  // 6. Demo Products for Lakshmi Handlooms
  if (seller1User.sellerProfile) {
    const p1 = await prisma.product.create({
      data: {
        sellerId: seller1User.sellerProfile.id,
        title: "Pure Mulberry Silk Pochampally Double Ikat Saree - Crimson & Indigo",
        shortDesc: "Traditional geometric tie-and-dye handwoven silk saree with intricate temple border.",
        longDesc: "Handcrafted over 14 days on a traditional pit loom by master weaver Lakshmi Devamma. Every warp and weft thread is precision-tied and dyed prior to weaving to produce the iconic Pochampally Ikat motifs. Certified with the Handloom Mark and Geographical Indication (GI).",
        category: "Handloom",
        craftType: "Pochampally Ikat",
        price: 7800,
        moq: 3,
        stock: 18,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
          "https://images.unsplash.com/photo-1606744888344-493238955de0?w=800&q=80",
        ]),
        material: "100% Pure Mulberry Silk & Natural Dyes",
        dimensions: "5.5 meters with 80cm blouse piece",
        weight: "620g",
        color: "Crimson Red & Deep Indigo",
        origin: "Pochampally, Telangana",
        careInstructions: "Dry clean only. Air dry in shade. Store wrapped in cotton cloth.",
        isHandmade: true,
        isGiTagged: true,
        keywords: "Pochampally, Ikat, Silk Saree, Handloom, Telangana GI, Wholesale Saree",
      },
    });

    const p2 = await prisma.product.create({
      data: {
        sellerId: seller1User.sellerProfile.id,
        title: "Handloom Organic Cotton Ikat Table Runner & Placemats Set",
        shortDesc: "Artisanal dining table set dyed with natural pomegranate peel and indigo leaves.",
        longDesc: "Durable, tightly woven organic handloom cotton set featuring contemporary geometric motifs inspired by Deccan architecture. Designed specifically for boutique hospitality and export retail.",
        category: "Handloom",
        craftType: "Pochampally Ikat",
        price: 1850,
        moq: 10,
        stock: 45,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80",
        ]),
        material: "100% Organic Handspun Cotton",
        dimensions: "Runner 72 x 14 inches; 6 Mats 18 x 12 inches",
        weight: "750g",
        color: "Indigo Blue & Natural Ecru",
        origin: "Pochampally, Telangana",
        careInstructions: "Gentle cold machine wash with mild detergent.",
        isHandmade: true,
        isGiTagged: true,
        keywords: "Home Decor, Table Runner, Ikat, Cotton, Hospitality Linen",
      },
    });

    // Create a sample review
    await prisma.review.create({
      data: {
        productId: p1.id,
        buyerId: buyerUser.id,
        rating: 5,
        comment: "Exquisite craftsmanship! The silk texture and dye precision exceeded our boutique buyers' expectations. Quick dispatch as well.",
      },
    });

    // Create a sample RFQ
    const buyerProfile = await prisma.buyerProfile.findUnique({ where: { userId: buyerUser.id } });
    if (buyerProfile) {
      const rfq = await prisma.rfq.create({
        data: {
          buyerId: buyerProfile.id,
          productId: p1.id,
          quantity: 25,
          deliveryLocation: "Hauz Khas Village Boutique, New Delhi",
          targetDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          targetBudget: 175000,
          customizationNotes: "Need customized unstitched blouse lengths and individual butter-paper heritage packaging.",
          status: "QUOTED",
        },
      });

      // Seller created a quote
      await prisma.quote.create({
        data: {
          rfqId: rfq.id,
          sellerId: seller1User.sellerProfile.id,
          unitPrice: 7200,
          shippingCost: 2500,
          totalAmount: 182500,
          estimatedDeliveryDays: 16,
          terms: "Includes custom packaging & insurance. 50% advance via Razorpay B2B.",
          status: "PENDING",
        },
      });
    }

    // Create a sample order
    await prisma.order.create({
      data: {
        orderNumber: "KC-2026-0042",
        buyerId: buyerUser.id,
        sellerId: seller1User.sellerProfile.id,
        productId: p2.id,
        quantity: 12,
        totalAmount: 22200,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        orderStatus: "PROCESSING",
        shippingAddress: "Virasat Luxury Retail, Plot 44, Hauz Khas, New Delhi 110016",
      },
    });

    // Create notification for Lakshmi Devamma
    await prisma.notification.create({
      data: {
        userId: seller1User.id,
        title: "New Wholesale Order Received!",
        message: "Virasat Luxury Boutiques ordered 12 units of Ikat Table Runner Set (Order #KC-2026-0042).",
        type: "ORDER",
        link: "/seller/orders",
      },
    });
  }

  // 7. Demo Products for Srinivasa Woodcraft
  if (seller2User.sellerProfile) {
    await prisma.product.create({
      data: {
        sellerId: seller2User.sellerProfile.id,
        title: "GI-Tagged Etikoppaka Natural Lacquer Wooden Toy Train Set",
        shortDesc: "100% child-safe, non-toxic turned wooden toy train colored with turmeric and indigo lac.",
        longDesc: "Turned by hand on a traditional lathe from sustainable Ankudu wood. Polished using organic dried leaves for a lustrous natural shine without any chemical varnishes. Celebrated for centuries across Andhra Pradesh.",
        category: "Woodcraft",
        craftType: "Etikoppaka Lacquer Toys",
        price: 950,
        moq: 15,
        stock: 80,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
        ]),
        material: "Ankudu Softwood (Wrightia Tinctoria) & Natural Lac",
        dimensions: "14 inches length (4 linked bogies)",
        weight: "380g",
        color: "Sun Yellow, Coral Red & Emerald Green",
        origin: "Etikoppaka, Visakhapatnam, Andhra Pradesh",
        careInstructions: "Wipe with dry microfiber cloth. Do not soak in water.",
        isHandmade: true,
        isGiTagged: true,
        keywords: "Etikoppaka, Wooden Toys, Montessori, Organic Toys, Andhra GI",
      },
    });
  }

  // 8. Demo Products for Jaipur Blue Art Pottery
  if (seller3User.sellerProfile) {
    await prisma.product.create({
      data: {
        sellerId: seller3User.sellerProfile.id,
        title: "Hand-Painted Jaipur Blue Pottery Mughal Floral Hexagonal Planter",
        shortDesc: "Authentic low-fire glazed pottery planter painted with cobalt blue motifs.",
        longDesc: "Crafted without clay using a unique dough made of ground quartz stone, glass, Multani Mitti, and natural gum. Hand-painted with traditional Mughal floral arabesques and glazed at low firing temperatures.",
        category: "Pottery",
        craftType: "Jaipur Blue Pottery",
        price: 1450,
        moq: 8,
        stock: 35,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80",
        ]),
        material: "Quartz Stone Powder, Multani Mitti, Natural Copper & Cobalt Oxides",
        dimensions: "8 inches diameter x 7 inches height",
        weight: "1.1 kg",
        color: "Cobalt Blue, Persian Turquoise & Ivory White",
        origin: "Jaipur, Rajasthan",
        careInstructions: "Hand wash with sponge. Suitable for indoor semi-shaded plants.",
        isHandmade: true,
        isGiTagged: true,
        keywords: "Blue Pottery, Jaipur, Ceramic Planter, Home Decor, Handmade Pottery",
      },
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
