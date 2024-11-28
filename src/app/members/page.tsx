'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [members, setMembers] = useState<any[]>([]) // To store members data
  const [loading, setLoading] = useState(true) // To show loading state

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/getMember')
      setMembers(res.data) // Assuming res.data is an array of members
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false) // Stop loading spinner
    }
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
          href='/members/addAthlete'
        >
          + Athlete
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
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='flex items-center gap-3'>
                    <div className='avatar placeholder'>
                      <div className='bg-neutral text-neutral-content w-8 rounded-full'>
                        <span className='text-xl'>
                          {member.firstName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    {member.firstName + ' ' + member.lastName}
                  </td>
                  <td className='text-center'>{member.id}</td>
                  <td className='text-center'>{member.gender}</td>
                  <td className='text-center'>{member.country}</td>
                  <td className='text-center'>{member.classification}</td>
                  <td className='text-center'>{member.dateOfBirth}</td>
                  <td className='text-center'>{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
