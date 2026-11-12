import { NextResponse } from "next/server";
import { getCatalog, getProduct } from "@/lib/shopify/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const product = await getProduct(slug);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    const catalog = await getCatalog();
    return NextResponse.json(catalog);
  } catch (error) {
    console.error("[api/catalog] Failed to retrieve catalog:", error);
    return NextResponse.json(
      { error: "Failed to retrieve catalog" },
      { status: 500 }
    );
  }
}
