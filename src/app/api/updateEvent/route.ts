import clientPromise from '@/app/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export const revalidate = 0

export async function POST(req) {
  try {
    const {
      _id,
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

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('events')

    const oid = new ObjectId(_id)
    const getEvent = await collection.findOne({ _id: oid })

    if (!getEvent) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }

    const update = {}

    // check if the value is different from the current value
    if (id && id !== getEvent.id) update.id = id
    if (date && date !== getEvent.date) update.date = date
    if (time && time !== getEvent.time) update.time = time
    if (gender && gender !== getEvent.gender) update.gender = gender
    if (name && name !== getEvent.name) update.name = name
    if (classification && classification !== getEvent.classification)
      update.classification = classification
    if (stage && stage !== getEvent.stage) update.stage = stage
    if (status && status !== getEvent.status) update.status = status
    if (remark && remark !== getEvent.remark) update.remark = remark

    if (Object.keys(update).length > 0) {
      const updateResult = await collection.updateOne({ id }, { $set: update })

      if (updateResult.matchedCount === 0) {
        return NextResponse.json(
          { success: false, message: 'Failed to update event' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error updating document:', e)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
