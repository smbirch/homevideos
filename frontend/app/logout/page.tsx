"use client"

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {logoutUser} from "@/app/services/userService";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import {getLocalUserData} from "@/app/utils/authUtils";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      console.log("perform logout");
      const localUser = getLocalUserData();
      try {
        if (localUser?.username) {
          await logoutUser({
            credentials: {
              username: localUser.username,
              password: ""
            },
            profile: localUser.profile,
            token: ""
          });
        }
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("user");
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsLoggingOut(false);
        window.location.href = '/';
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="bg-black text-white h-screen flex justify-center items-center text-2xl">
      <div className="flex flex-col items-center gap-4">
        <div>Goodbye!</div>
        {isLoggingOut && (
          <div className="text-sm text-gray-400">Logging out...<br/><LoadingSpinner/></div>
        )}
      </div>
    </div>
  );
}
