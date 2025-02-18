import clientPromise from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'

export const revalidate = 0

export async function POST(req) {
  try {
    const { id_event, athletes_result } = await req.json()

    const client = await clientPromise
    const db = client.db('Athlests')
    const collection = db.collection('event_with_athlests')

    // ค้นหา event ตาม id_event
    const event = await collection.findOne({ id_event })

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
      )
    }

    // นำผลการแข่งขันที่มีอยู่แล้วมารวมกับผลการแข่งขันใหม่
    const existingResults = event.athletes_result || []
    const updatedResults = [...existingResults] // Clone existing results

    athletes_result.forEach((newResult) => {
      const index = updatedResults.findIndex(
        (existing) => existing.id_member === newResult.id_member
      )

      if (index !== -1) {
        // อัปเดตผลการแข่งขันถ้า id_member ตรงกัน
        updatedResults[index] = { ...updatedResults[index], ...newResult }
      } else {
        // เพิ่มผลการแข่งขันใหม่ถ้า id_member ยังไม่มีในระบบ
        updatedResults.push(newResult)
      }
    })

    // อัปเดตผลการแข่งขันในฐานข้อมูล
    await collection.updateOne(
      { id_event },
      { $set: { athletes_result: updatedResults } }
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (e) {
    console.error('Error updating document:', e.message, e.stack)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
