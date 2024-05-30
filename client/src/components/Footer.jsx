import React from 'react';
import logo from '../../img/logo.png';

const Footer = () => {
  return (
    <div className='flex flex-col md:flex-row  justify-evenly items-center gap-8 text-white bg-gray-900 w-full md:h-16 '>
      <div className=''>
        <img src={logo} className="h-8" alt="Samriddhi Logo" />
      </div>
      <div className='md:text-center'>
        <span className="block text-sm text-gray-500 dark:text-gray-400 hover:underline">© 2024, Built with love by Samriddhi Mishra</span>
      </div>
      <div className=''>
        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Linkedin</a>
          </li>
          <li>
            <a href="#" className="hover:underline me-4 md:me-6">Github</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Instagram</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
