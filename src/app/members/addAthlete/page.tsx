'use client'

import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { uploadImage } from '@/app/lib/cloundinsry'
import Swal from 'sweetalert2'

import LiatCountry from '@/app/master/lisyCountry.json'

export default function page() {
  const router = useRouter()
  const [file, setFile] = useState(null) // To store the file
  const [preview, setPreview] = useState(null) // To store the preview URL
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [id, setId] = useState('')
  const [gender, setGender] = useState('Male')
  const [country, setCountry] = useState(LiatCountry[0].name)
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
      Swal.fire({
        title: 'Missing required fields',
        icon: 'error',
      })
      return
    }
    setLoading(true)
    try {
      let uploadImg = ''
      if (file) {
        uploadImg = await uploadImage(file, id)
      }
      const res = await axios.post('/api/createMember', {
        firstName,
        lastName,
        id,
        gender,
        country,
        classification,
        dateOfBirth,
        email,
        file: uploadImg,
      })
      if (res.data.success) {
        await Swal.fire({
          title: 'Athlete created successfully',
          icon: 'success',
        })
        router.push('/members')
      }
    } catch (e) {
      console.error('Error adding document:', e)
      alert('Internal Server Error')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile.size || selectedFile.size > 1000000) {
      Swal.fire({
        title: 'File size is too large',
        text: 'Please upload a file less than 1MB',
        icon: 'error',
      })

      return
    }

    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  return (
    <div className='m-10'>
      <h1 className='text-xl font-bold text-center'>Create New Athlete</h1>
      <form className='mt-5 flex flex-col gap-4'>
        <div className='flex flex-col justify-center items-center gap-4'>
          <div className='avatar'>
            <div className='w-24 text-center'>
              {preview ? (
                <Image
                  src={preview}
                  alt='Uploaded Preview'
                  width={100}
                  height={100}
                />
              ) : (
                <p>Plase upload a photo (Optional) (Max 1MB)</p>
              )}
            </div>
          </div>
          <input
            type='file'
            className='file-input file-input-xs w-full max-w-xs'
            onChange={handleFileChange}
          />
        </div>

        <div>
          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>First Name*</span>
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
                <span className='label-text'>Last Name*</span>
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
                <span className='label-text'>ID*</span>
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
                <span className='label-text'>Gender*</span>
              </div>
              <select
                className='select select-bordered w-full max-w-xs'
                onChange={(e) => setGender(e.target.value)}
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Not Prefer'>Not Prefer</option>
              </select>
            </label>
          </div>

          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Country*</span>
              </div>
              {LiatCountry && (
                <select
                  className='select select-bordered w-full max-w-xs'
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {LiatCountry.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              )}
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Classification*</span>
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
                <span className='label-text'>Date of Birth*</span>
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
                <span className='label-text'>E-mail*</span>
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
              <>
                <span className='loading loading-dots loading-lg'></span>
                <span>
                  Please wait while we create the athlete. This may take a few
                </span>
              </>
            ) : (
              'Create Athlete'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
