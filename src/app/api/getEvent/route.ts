import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/app/lib/mongodb'
import { ObjectId } from 'mongodb'

export const revalidate = 0

export async function GET(req: NextRequest) {
  try {
    // Get the query parameters using URL parsing
    const url = new URL(req.url)
    const date = url.searchParams.get('date') // Get the 'date' query parameter
    const _id = url.searchParams.get('_id')

    // Normalize the date to "yyyy-mm-dd" format (ignoring time)
    const formattedDate = new Date(date).toISOString().split('T')[0] // Get only the date part (yyyy-mm-dd)

    const client = await clientPromise
    const db = client.db('Athlests')
    const oid = new ObjectId(_id)

    if (_id) {
      const events = await db.collection('events').findOne({
        _id: oid,
      })
      return NextResponse.json(events)
    }

    const events = await db
      .collection('events')
      .find({
        date: { $regex: `^${formattedDate}` }, // Match documents where the date starts with "yyyy-mm-dd"
      })
      .toArray()

    return NextResponse.json(events)
  } catch (e) {
    console.error('Error fetching events:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
