import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import EditListingForm from "./form";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) notFound();
  if (listing.userId !== session.user.id) redirect("/profile");

  return (
    <EditListingForm
      listing={{
        id: listing.id,
        brand: listing.brand,
        size: listing.size,
        condition: listing.condition,
        price: listing.price.toString(),
        description: listing.description ?? "",
        images: listing.images,
        pickupAvailable: listing.pickupAvailable,
        shippingAvailable: listing.shippingAvailable,
        shippingCost: listing.shippingCost?.toString() ?? "",
        shipsFromCity: listing.shipsFromCity ?? "",
        shipsFromState: listing.shipsFromState ?? "",
        handlingTime: listing.handlingTime ?? "",
        preferredCarrier: listing.preferredCarrier ?? "",
      }}
    />
  );
}
