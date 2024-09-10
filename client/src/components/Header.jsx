import { NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

export default function Header() {
  //context to set a global value for the header
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <nav className="flex flex-row gap-4 pl-4 pr-16 justify-between p-2 bg-gray-900 text-white">
        <div>
          <NavLink to="/" className="logo text-teal-500 animate-fall2 ml-10 font-mono text-2xl p-0 font-bold">
          BlogBeam
          </NavLink>
        </div>
        <div className=" flex flex-row gap-16 font-bold  font-mono text-gray-400 text-xl hover:text-white ">
          {username && (
            <>
              <NavLink to="/create">Create New Post</NavLink>
              <a onClick={logout}>Logout ({username})</a>
            </>
          )}
          {!username && (
            <>
              <NavLink to="/login" className='hover:text-teal-500 hover:font-bold'>Login</NavLink>
              <NavLink to="/register" className='hover:text-teal-500 hover:font-bold'>Signup</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
