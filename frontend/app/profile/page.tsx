"use client"
// pages/profile.js
import { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the "user" item from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      // Parse the JSON string into an object
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return <p>Loading user information...</p>;
  }


  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Profile</h1>
      <div style={styles.info}>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>First Name:</strong> {user.profile.firstName}</p>
        <p><strong>Last Name:</strong> {user.profile.lastName}</p>
        <p><strong>Email:</strong> {user.profile.email}</p>
        <p><strong>Admin:</strong> {user.profile.admin ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
  },
  header: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  info: {
    backgroundColor: '#000',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lineHeight: '3',
  },
};
