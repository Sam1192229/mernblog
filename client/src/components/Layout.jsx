import Footer from "./Footer";
import Header from "./Header";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <main className="bg-gray-800 min-h-screen">
      <Header />
      <Outlet />
      <Footer/>
    </main>
  );
}