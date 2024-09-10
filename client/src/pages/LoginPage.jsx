import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../UserContext";
import blogImage from '../assets/temp.jfif';

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <form
    className="login register flex flex-col gap-8 items-center border-2 border-gray-500 mx-auto align-middle mt-20 w-1/3 rounded-2xl p-20 "
    onSubmit={login}
    style={{
      backgroundImage: `url(${blogImage})`, // Replace with your image path
      backgroundSize: 'cover', // Cover the entire form area
      backgroundPosition: 'center', // Center the image
    }}
  >
      <h1 className="text-center p-4 text-gray-200 text-3xl animate-fall font-extrabold">Login to add your post! ❤️</h1>
      <input type="text"
      className="border-2 border-teal-500 p-2 w-64 rounded-md bg-gray-200"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="password"
        className="border-2 border-teal-500 p-2 w-64 rounded-md bg-gray-200"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button className="border-2 border-gray-500 p-2 rounded-lg text-gray-200 transition ease-in-out delay-150 bg-gray-800 hover:-translate-y-1 hover:scale-110 hover:bg-teal-500 duration-300 hover:text-white">Login</button>
    </form>
  );
}
