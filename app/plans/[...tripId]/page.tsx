import { auth } from "@/auth";
import TripDetailClient from "@/components/templates/trip-detail";
import { prisma } from "@/lib/prisma";

export default async function TripDetaile({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const session = await auth();
  if (!session) {
    return <div>Please Sing in first.</div>;
  }

  const tripIdString = Array.isArray(tripId) ? tripId[0] : tripId; // ← اضافه کن

  const trip = await prisma.trip.findFirst({
    where: { id: tripIdString, userId: session.user?.id },
  });
  if (!trip) {
    return <div>Trip not found!</div>;
  }
  return <TripDetailClient />;
}
