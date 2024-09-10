import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import blogImage from '../assets/temp.jfif';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-800 ">
      style={{
      backgroundImage: `url(${blogImage})`, // Replace with your image path
      backgroundSize: 'cover', // Cover the entire form area
      backgroundPosition: 'center', // Center the image
    }}
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
