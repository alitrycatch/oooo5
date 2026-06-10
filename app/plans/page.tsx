import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import Link from "next/link";
import React from "react";

async function TripsPage() {
  const session = await auth();
  const trips = await prisma.trip.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.endDate).getTime(),
  );

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today,
  );
  if (!session) return <h2>Please sing in first...!</h2>;
  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight border-b-2 border-gray-200 ">
          Dashboard
        </h1>
        <Link href={"/plans/new"}>
          <button className="transition cursor-pointer flex items-center justify-center bg-cyan-800 hover:bg-cyan-600 rounded-sm text-white p-1">
            New Trips
          </button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            Hello dear {session.user?.name} . here is your trips
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p>
            {trips.length === 0
              ? "start planning your first trip"
              : `you have ${trips.length} ${trips.length === 1 ? "trip" : "trips"} planned . ${
                  upcomingTrips.length > 0
                    ? ` ${upcomingTrips.length} upcoming`
                    : ""
                }`}
          </p>
        </CardContent>
      </Card>
      <div>
        <h2 className="mb-2">your recent trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <h3 className="text-xl font-medium mb-2">No trips yet...</h3>
              <p className="text-center mb-4 max-w-md">Start your first trip</p>
              <Link href={"/plans/new"}>
                <button className="transition cursor-pointer flex items-center justify-center bg-cyan-800 hover:bg-cyan-600 rounded-sm text-white p-1">
                  New Trips
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTrips.slice(0, 6).map((trip, key) => (
              <Link key={key} href={""}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{trip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2 mb-2">
                      {trip.description}
                    </p>
                    <div className="text-sm">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}{" "}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TripsPage;
