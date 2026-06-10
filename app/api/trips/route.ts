import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const trips = await prisma.trip.findMany({
    include: { locations: true }
  })
  return NextResponse.json(trips)
}

export async function POST(req: Request) {
  const body = await req.json()

  const trip = await prisma.trip.create({
    data: {
      title: body.title,
      description: body.description,
      imageUrl: body.imageUrl,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      userId: body.userId,
      locations: {
        create: body.locations // آرایه لوکیشن‌ها
      }
    },
    include: { locations: true }
  })

  return NextResponse.json(trip)
}