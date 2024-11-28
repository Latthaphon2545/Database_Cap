'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'

export default function page() {
  const [file, setFile] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [id, setId] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('')
  const [classification, setClassification] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !firstName ||
      !lastName ||
      !email ||
      !id ||
      !gender ||
      !country ||
      !classification ||
      !dateOfBirth
    ) {
      alert('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/createMember', {
        firstName,
        lastName,
        id,
        gender,
        country,
        classification,
        dateOfBirth,
        email,
      })
      if (res.data.success) {
        alert('Athlete created successfully')
        window.location.href = '/members'
      }
    } catch (e) {
      console.error('Error adding document:', e)
      alert('Internal Server Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='m-10'>
      <h1 className='text-3xl font-bold text-center'>Create New Athlete</h1>
      <form className='mt-5 flex flex-col gap-4'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className='avatar'>
            <div className='w-24 rounded'>
              <img src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' />
            </div>
          </div>
          <input type='file' className='file-input w-full max-w-xs' />
        </div>

        <div>
          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>First Name</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Last Name</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
              />
            </label>
          </div>

          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>ID</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setId(e.target.value)}
                value={id}
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Gender</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              />
            </label>
          </div>

          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Country</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setCountry(e.target.value)}
                value={country}
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Classification</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setClassification(e.target.value)}
                value={classification}
              />
            </label>
          </div>

          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Date of Birth</span>
              </div>
              <input
                type='date'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setDateOfBirth(e.target.value)}
                value={dateOfBirth}
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>E-mail</span>
              </div>
              <input
                type='email'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </label>
          </div>
        </div>

        <div className='flex justify-end gap-5'>
          <Link className='btn btn-secondary btn-outline' href='/members'>
            Back
          </Link>
          <button
            className='btn btn-primary btn-outline'
            onClick={handleSubmit}
            disabled={loading}
            type='submit'
          >
            {loading ? (
              <span className='loading loading-dots loading-lg'></span>
            ) : (
              'Create Athlete'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
