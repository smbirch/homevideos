// "use client";
//
// import React, {useState, useEffect} from 'react';
// import Link from 'next/link';
// import {usePathname} from 'next/navigation';
// import {UserCircle} from 'lucide-react';
//
//
// interface UserProfile {
//   firstName: string;
//   lastName: string;
//   email: string;
//   admin: boolean;
// }
//
// interface User {
//   id: number;
//   username: string;
//   profile: UserProfile;
// }
//
// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [isClient, setIsClient] = useState(false);
//   const pathname = usePathname();
//
//   // Function to check user auth status
//   // TODO: abstract this out using authUtils
//   const checkAuthStatus = () => {
//     // Only run on client-side
//     if (typeof window !== 'undefined') {
//       const userData = localStorage.getItem('user');
//       if (userData) {
//         try {
//           const parsedUser = JSON.parse(userData) as User;
//           setUser(parsedUser);
//         } catch (error) {
//           console.error('Error parsing user data:', error);
//           localStorage.removeItem('user');
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//     }
//   };
//
//   useEffect(() => {
//     setIsClient(true);
//     checkAuthStatus();
//
//     const handleStorage = () => checkAuthStatus();
//     window.addEventListener('storage', handleStorage);
//     window.addEventListener('authChange', handleStorage);
//
//     return () => {
//       window.removeEventListener('storage', handleStorage);
//       window.removeEventListener('authChange', handleStorage);
//     };
//   }, []);
//
//   useEffect(() => {
//     setIsDropdownOpen(false);
//   }, [pathname]);
//
//   // Prevent hydration mismatch
//   if (!isClient) {
//     return (
//       <nav className="bg-gray-800 p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <Link href="/" className="text-white text-2xl font-bold">
//             HomeVideos
//           </Link>
//           <div>
//             <UserCircle size={32} className="text-white"/>
//           </div>
//         </div>
//       </nav>
//     );
//   }
//
//   return (
//     <nav className="bg-gray-800 p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="text-white text-2xl font-bold">
//           HomeVideos
//         </Link>
//         <div className="relative">
//           <button
//             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//             className="text-white focus:outline-none"
//           >
//             <UserCircle size={32}/>
//           </button>
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
//               {user ? (
//                 <>
//                   <div className="px-4 py-2 text-sm text-gray-500 border-b">
//                     {user.username}
//                   </div>
//                   <Link
//                     href="/logout"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Logout
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     href="/login"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href="/register"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };
//
// export default Navbar;
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle } from "lucide-react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  admin: boolean;
}

interface User {
  id: number;
  username: string;
  profile: UserProfile;
}

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Function to check user auth status
  const checkAuthStatus = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
    checkAuthStatus();

    const handleStorage = () => checkAuthStatus();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleStorage);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isClient) {
    return (
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-2xl font-bold">
            HomeVideos
          </Link>
          <div>
            <UserCircle size={32} className="text-white" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          HomeVideos
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white focus:outline-none"
          >
            <UserCircle size={32} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    {user.username}
                  </div>
                  <Link
                    href="/logout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
