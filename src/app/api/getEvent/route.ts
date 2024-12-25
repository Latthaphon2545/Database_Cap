import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('Athlests')
    const customers = await db.collection('events').find({}).toArray()
    return NextResponse.json(customers)
  } catch (e) {
    console.error('Error fetching documents:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
