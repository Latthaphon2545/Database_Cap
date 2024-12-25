'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import Swal from 'sweetalert2'

import StageJSON from '../../master/stage.json'
import StatusJSON from '../../master/status.json'

export default function page() {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [id, setID] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('Male')
  const [classification, setClassification] = useState('')
  const [time, setTime] = useState('')
  const [stage, setStage] = useState(StageJSON[0].name)
  const [status, setStatus] = useState(StatusJSON[0].name)
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!date || !id || !gender || !name || !classification || !time) {
      Swal.fire({
        title: 'Missing required fields',
        icon: 'error',
      })
      return
    }
    setLoading(true)
    try {
      const res = await axios.post('/api/createEvent', {
        date,
        time,
        id,
        name,
        gender,
        classification,
        stage,
        status,
        remark,
      })
      if (res.data.success) {
        await Swal.fire({
          title: 'Athlete created successfully',
          icon: 'success',
        })
        router.push('/events')
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
      <h1 className='text-xl font-bold text-center'>Create New Event</h1>
      <form className='mt-5 flex flex-col gap-4'>
        <div>
          <div className='flex justify-around'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Date*</span>
              </div>
              <input
                type='date'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Time*</span>
              </div>
              <input
                type='time'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setTime(e.target.value)}
                value={time}
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
                onChange={(e) => setID(e.target.value)}
                value={id}
                required
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Name*</span>
              </div>
              <input
                type='text'
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </label>
          </div>

          <div className='flex justify-around'>
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
        </div>

        <div className='flex justify-around'>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Stage</span>
            </div>
            <select
              className='select select-bordered w-full max-w-xs'
              onChange={(e) => setStage(e.target.value)}
              value={stage}
            >
              {StageJSON.map((stage) => (
                <option key={stage.name} value={stage.name}>
                  {stage.label}
                </option>
              ))}
            </select>
          </label>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Status</span>
            </div>
            <select
              className='select select-bordered w-full max-w-xs'
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              {StatusJSON.map((status) => (
                <option key={status.name} value={status.name}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className='flex justify-around'>
          <label className='form-control w-full max-w-xs'>
            <div className='label'>
              <span className='label-text'>Remark</span>
            </div>
            <textarea
              className='textarea textarea-bordered textarea-sm w-full max-w-xs'
              onChange={(e) => setRemark(e.target.value)}
              value={remark}
            ></textarea>
          </label>
        </div>

        <div className='flex justify-end gap-5'>
          <Link className='btn btn-secondary btn-outline' href='/events'>
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
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
