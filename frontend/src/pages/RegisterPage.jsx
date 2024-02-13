import React, { useState } from 'react'

function RegisterPage() {
  const [form , setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: ''
  })

  const inputClasses = "border border-gray-200 rounded-md p-1 m-2";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen text-gray-900'>
      <div className='flex flex-col justify-center items-center bg-gray-100 p-10 rounded-lg'>
        <h1>Register</h1>
          <form 
          className='flex flex-col justify-center items-center'
        >
          <input 
            placeholder='First Name'
            className={inputClasses}
            name='firstName'
            onChange={handleChange}
          />
          <input 
            placeholder='Last Name'
            className={inputClasses}
            name='lastName'
            onChange={handleChange}
          />
          <input 
            placeholder='email'
            className={inputClasses}
            name='email'
            onChange={handleChange}
          />
          <input 
            placeholder='password'
            className={inputClasses}
            name='password'
            onChange={handleChange}
          />
          <input 
            placeholder='role'
            className={inputClasses}
            name="role"
            onChange={handleChange}
          />
          <button
            className='bg-gray-400 hover:bg-gray-600 border border-black rounded-sm py-1 px-3 mt-3'
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage;