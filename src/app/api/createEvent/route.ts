import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    const {
      date,
      id,
      gender,
      name,
      classification,
      time,
      stage,
      status,
      remark,
    } = await req.json()

    if (
      !date ||
      !id ||
      !gender ||
      !name ||
      !classification ||
      !time ||
      !stage ||
      !status
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('events')

    // conver date and time to ISO string
    // const dateISO = new Date(date).toISOString()
    // const timeISO = new Date(time).toISOString()

    // combine date and time
    // const dateISOString = dateISO.split('T')[0]
    // const timeISOString = timeISO.split('T')[1].split('.')[0]
    // const dateTime = `${dateISOString}T${timeISOString}`
    // const date = new Date(dateTime)

    await collection.insertOne({
      date,
      time,
      id,
      gender,
      name,
      classification,
      stage,
      status,
      remark,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error adding document:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
