"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Close the dropdown when the pathname changes
    setIsDropdownOpen(false);
  }, [pathname]);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          HomeVideos
        </Link>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white focus:outline-none"
          >
            <UserCircle size={32} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Login
              </Link>
              <Link href="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Sign Up
              </Link>
              <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
