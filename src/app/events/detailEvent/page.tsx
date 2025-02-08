'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Swal from 'sweetalert2'
import { MdAdd, MdDelete } from 'react-icons/md'
import Image from 'next/image'
import fetchAuth from '@/app/lib/getAuth'

interface Member {
  _id: string
  id: string
  firstName: string
  lastName: string
  imgProfile?: string
  classification: string
  country: string
}

interface Event {
  id: string
  date: string
  gender: string
  classification: string
  stage: string
  status: string
  remark: string
}

export default function EventDetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [event, setEvent] = useState<Event | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [memberEvent, setMemberEvent] = useState<Member[]>([])
  const [loadingMember, setLoadingMember] = useState(true)
  const [loadingMemberEvent, setLoadingMemberEvent] = useState(true)
  const [auth, setAuth] = useState<any>(null)

  // Fetch event details and associated athletes
  const fetchEventWithAthletes = async () => {
    try {
      const res = await axios.get(`/api/getEventWithAthletes?id_event=${id}`)
      setEvent(res.data[0]?.event_info[0] || null)
      setMemberEvent(res.data[0]?.athletes || [])
    } catch (err) {
      console.error('Error fetching event with athletes:', err)
    } finally {
      setLoadingMemberEvent(false)
    }
  }

  // Fetch members excluding those already in the event
  const fetchMembers = async () => {
    try {
      const idIgnore = memberEvent.map((member) => member._id).join(',')
      const res = await axios.get(
        `/api/getMember?gender=${event?.gender}&idIgnore=${idIgnore}`
      )
      setMembers(res.data)
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setLoadingMember(false)
    }
  }

  // Add an athlete to the event
  const handleAddAthlete = async (athleteId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this athlete to the event?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, add it',
      cancelButtonText: 'No, cancel',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.post('/api/addAthleteToEvent', {
            id_event: event?.id,
            athlete_id: athleteId,
          })
          await fetchEventWithAthletes() // Refresh event data
        } catch (err) {
          console.error('Error adding athlete:', err)
        }
      },
    })
  }

  // Remove an athlete from the event
  const handleDeleteAthlete = async (athleteId: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this athlete from the event?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.post('/api/deleteAthleteFromEvent', {
            id_event: event?.id,
            athlete_id: athleteId,
          })
          await fetchEventWithAthletes() // Refresh event data
        } catch (err) {
          console.error('Error deleting athlete:', err)
        }
      },
    })
  }

  // Fetch authentication data
  useEffect(() => {
    fetchAuth().then((data) => setAuth(data))
  }, [])

  // Fetch event and athletes when `id` changes
  useEffect(() => {
    if (id) {
      fetchEventWithAthletes()
    }
  }, [id])

  // Fetch members when `memberEvent` changes
  useEffect(() => {
    if (memberEvent.length > 0) {
      fetchMembers()
    }
  }, [memberEvent])

  // Render loading state
  if (loadingMemberEvent) {
    return <span className='loading loading-dots loading-lg'></span>
  }

  // Render event details
  const renderEventDetails = () => {
    if (!event) return <p>No event details found.</p>

    return (
      <div className='mt-4'>
        <div className='mt-2'>
          <p>
            <span className='font-bold'>Date:</span>{' '}
            {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
          </p>
          <p>
            <span className='font-bold'>Time:</span>{' '}
            {event.date ? new Date(event.date).toLocaleTimeString() : 'N/A'}
          </p>
          <p>
            <span className='font-bold'>ID:</span> {event.id || 'N/A'}
          </p>
          <p>
            <span className='font-bold'>Gender:</span> {event.gender || 'N/A'}
          </p>
          <p>
            <span className='font-bold'>Classification:</span>{' '}
            {event.classification || 'N/A'}
          </p>
          <p>
            <span className='font-bold'>Stage:</span> {event.stage || 'N/A'}
          </p>
          <p>
            <span className='font-bold'>Status:</span> {event.status || 'N/A'}
          </p>
          <p>
            <span className='font-bold'>Remark:</span> {event.remark || 'N/A'}
          </p>
        </div>
      </div>
    )
  }

  // Render athletes in the event
  const renderAthletesInEvent = () => {
    if (loadingMemberEvent) {
      return <span className='loading loading-dots loading-lg'></span>
    }

    if (memberEvent.length === 0) {
      return <p>No athletes found in this event.</p>
    }

    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Athlete Name</th>
            <th className='text-center'>ID</th>
            <th className='text-center'>Classification</th>
            <th className='text-center'>Country</th>
            {auth && <th className='text-center'>Action</th>}
          </tr>
        </thead>
        <tbody>
          {memberEvent.map((member) => (
            <tr key={member._id} className='hover:bg-gray-100'>
              <td className='flex items-center gap-3'>
                {member.imgProfile ? (
                  <Image
                    src={member.imgProfile}
                    alt={`${member.firstName} ${member.lastName}`}
                    className='w-8 h-8 rounded-full'
                    width={32} // Set only width
                    height={32} // Set only height
                    style={{ width: 'auto', height: 'auto' }} // Preserve aspect ratio
                  />
                ) : (
                  <div className='avatar placeholder'>
                    <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                      <span className='text-xl'>
                        {member.firstName.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                {`${member.firstName} ${member.lastName}`}
              </td>
              <td className='text-center'>{member.id}</td>
              <td className='text-center'>{member.classification}</td>
              <td className='text-center'>{member.country}</td>
              {auth && (
                <td className='text-center'>
                  <button
                    className='btn btn-sm btn-outline btn-error'
                    onClick={() => handleDeleteAthlete(member.id)}
                  >
                    <MdDelete />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  // Render available athletes
  const renderAvailableAthletes = () => {
    if (!auth) return null

    if (loadingMember) {
      return <span className='loading loading-dots loading-lg'></span>
    }

    if (members.length === 0) {
      return <p>No athletes available to add.</p>
    }

    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Athlete Name</th>
            <th className='text-center'>ID</th>
            <th className='text-center'>Classification</th>
            <th className='text-center'>Country</th>
            <th className='text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id} className='hover:bg-gray-100'>
              <td className='flex items-center gap-3'>
                {member.imgProfile ? (
                  <Image
                    src={member.imgProfile}
                    alt={`${member.firstName} ${member.lastName}`}
                    className='w-8 h-8 rounded-full'
                    width={32} // Set only width
                    height={32} // Set only height
                    style={{ width: 'auto', height: 'auto' }} // Preserve aspect ratio
                  />
                ) : (
                  <div className='avatar placeholder'>
                    <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                      <span className='text-xl'>
                        {member.firstName.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
                {`${member.firstName} ${member.lastName}`}
              </td>
              <td className='text-center'>{member.id}</td>
              <td className='text-center'>{member.classification}</td>
              <td className='text-center'>{member.country}</td>
              <td className='text-center'>
                <button
                  className='btn btn-sm btn-primary btn-outline'
                  onClick={() => handleAddAthlete(member.id)}
                >
                  <MdAdd />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div>
      <h1 className='text-3xl font-bold'>Detail Event</h1>
      {renderEventDetails()}

      <div className='mt-5 flex justify-between gap-10'>
        {/* Table of Athletes in this Event */}
        <div className='overflow-x-auto mt-5 w-[50%]'>
          <h2 className='text-2xl font-bold'>List of Athletes in this Event</h2>
          {renderAthletesInEvent()}
        </div>

        {/* Table of Available Athletes */}
        {auth && (
          <div className='overflow-x-auto mt-5 w-[50%]'>
            <h2 className='text-2xl font-bold'>List of Athletes</h2>
            {renderAvailableAthletes()}
          </div>
        )}
      </div>
    </div>
  )
}
