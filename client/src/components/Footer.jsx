import React from 'react';

const Footer = () => {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center gap-8 text-white bg-gray-900 w-full md:h-10 p-4'>
      <div className='flex-1 flex justify-center'>
        <span className="block text-sm font-bold text-teal-500 hover:underline ml-52">
          © 2024, by Samriddhi Mishra
        </span>
      </div>
      <div className='flex justify-end'>
        <ul className="flex flex-wrap items-center mb-0 text-sm font-medium text-gray-500 dark:text-gray-400">
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
