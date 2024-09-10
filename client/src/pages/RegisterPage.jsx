import { useState } from "react";
import {Navigate } from "react-router-dom";
import blogImage from '../assets/temp.jfif';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  async function register(ev) {
    ev.preventDefault();
    //this data sent is called as payload
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      setRedirect(true);
    } else {
      alert('Registration failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/login'} />;
  }

  return (
      <form className="register flex flex-col gap-8 items-center border-2 border-gray-500 mx-auto align-middle mt-20 w-1/3 rounded-2xl p-20 " onSubmit={register} style={ {
        backgroundImage: `url(${blogImage})`, // Replace with your image path
        backgroundSize: 'cover', // Cover the entire form area
        backgroundPosition: 'center', // Center the image
      }}>
        <h1 className="text-center p-4 text-gray-200 text-3xl animate-fall font-extrabold">Register Now</h1>
        <input
          type="text"
          className="border-2 border-teal-500 p-2 w-64 rounded-md bg-gray-200"
          placeholder="Username"
          value={username}
          onChange={ev => setUsername(ev.target.value)}
        />
        <input
          type="password"
          className="border-2 border-teal-500 p-2 w-64 rounded-md bg-gray-200"
          placeholder="Password"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
        />
        <button type="submit" className="border-2 border-gray-500 p-2 rounded-lg text-gray-200 transition ease-in-out delay-150 bg-gray-800 hover:-translate-y-1 hover:scale-110 hover:bg-teal-500 duration-300 hover:text-white">
          Register
        </button>
      </form>
  );
}
