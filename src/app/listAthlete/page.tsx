'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import Swal from 'sweetalert2'

export default function Page() {
  const [members, setMembers] = useState<any[]>([]) // To store members data
  const [loading, setLoading] = useState(true) // To show loading state

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/getMember')
      setMembers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this athlete!',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      loaderHtml: '<span class="loading loading-lg"></span>',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await axios.post('/api/deleteMember', { _id: id })
        } catch (e) {
          console.error('Error deleting document:', e)
          Swal.fire({
            title: 'Error deleting event',
            text: 'Internal Server Error',
            icon: 'error',
          })
        } finally {
          await fetchMembers()
        }
      },
      //
    })
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Table of Athletes</h1>
        <Link
          className='btn btn-primary btn-outline'
          onClick={fetchMembers}
          href='/listAthlete/createAthlete'
        >
          Add Athlete
        </Link>
      </div>

      <div className='overflow-x-auto mt-5'>
        {loading ? (
          <span className='loading loading-dots loading-lg'></span>
        ) : members.length === 0 ? (
          <p>No members found.</p> // Handle empty data
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>Athlete Name</th>
                <th className='text-center'>ID</th>
                <th className='text-center'>Gender</th>
                <th className='text-center'>Country</th>
                <th className='text-center'>Classification</th>
                <th className='text-center'>Date of Birth</th>
                <th className='text-center'>E-mail</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='flex items-center gap-3'>
                    {member.imgProfile ? (
                      <Image
                        src={member.imgProfile}
                        alt={member.firstName}
                        className='w-8 h-8 rounded-full'
                        width={32}
                        height={32}
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
                    {member.firstName + ' ' + member.lastName}
                  </td>
                  <td className='text-center'>{member.id}</td>
                  <td className='text-center'>{member.gender}</td>
                  <td className='text-center'>{member.country}</td>
                  <td className='text-center'>{member.classification}</td>
                  <td className='text-center'>{member.dateOfBirth}</td>
                  <td className='text-center'>{member.email}</td>
                  <td className='flex gap-2 justify-center'>
                    <button
                      className='btn btn-error btn-outline btn-sm'
                      onClick={() => handleDelete(member._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
