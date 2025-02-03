"use client"

import React, { useState, useEffect } from 'react';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: false,
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    let timerId: string | number | NodeJS.Timeout | undefined;
    if (passwordError) {
      timerId = setTimeout(() => {
        setPasswordError('');
      }, 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [passwordError]);

  // @ts-ignore
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: false
    }));
    // don't clear passwordError so useEffect can handle the timeout
  };

  // @ts-ignore
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      username: formData.username.trim() === '',
      firstName: formData.firstName.trim() === '',
      lastName: formData.lastName.trim() === '',
      email: formData.email.trim() === '',
      password: formData.password.trim() === '',
      confirmPassword: formData.confirmPassword.trim() === ''
    };

    setErrors(newErrors);

    const hasEmptyFields = Object.values(newErrors).some(error => error);

    const passwordsMatch = formData.password === formData.confirmPassword;

    if (hasEmptyFields) {
      return;
    }

    if (!passwordsMatch) {
      setPasswordError('Passwords do not match');
      return;
    }

    console.log('Form submitted', formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-lg w-full max-w-md"
      >
        {passwordError && (
          <div className="mb-4 p-2 bg-red-600 text-white rounded text-center">
            {passwordError}
          </div>
        )}
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 text-white placeholder-gray-500 rounded
              ${errors.username ? 'border-2 border-red-500' : ''}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 text-white placeholder-gray-500 rounded
              ${errors.firstName ? 'border-2 border-red-500' : ''}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 text-white placeholder-gray-500 rounded
              ${errors.lastName ? 'border-2 border-red-500' : ''}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 text-white placeholder-gray-500 rounded
              ${errors.email ? 'border-2 border-red-500' : ''}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 text-white placeholder-gray-500 rounded
              ${errors.password ? 'border-2 border-red-500' : ''}`}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-2 bg-gray-700 text-white placeholder-gray-500 rounded
              ${errors.confirmPassword ? 'border-2 border-red-500' : ''}`}
          />
        </div>



        <button
          type="submit"
          className="w-full p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
