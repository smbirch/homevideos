"use client"

import {useEffect, useState} from 'react';
import {logoutUser} from "@/app/services/userService";
import {useRouter} from 'next/navigation';
import {removeCookie} from "@/app/utils/cookieUtils";
import {UserRequestDto} from "@/app/types/user";


export default function LogoutPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(true);

  useEffect(() => {
    let isActive = true;
    let timeoutId: NodeJS.Timeout;

    const performLogout = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          console.log("No user found in localStorage");
          if (isActive) {
            router.push('/');
          }
          return;
        }

        const parsedUser = JSON.parse(userStr);
        const userRequestDto: UserRequestDto = {
          credentials: {
            username: parsedUser.username,
            password: ""
          },
          profile: parsedUser.profile,
          token: ''
        };

        timeoutId = setTimeout(async () => {
          if (isActive) {
            try {
              await logoutUser(userRequestDto);
              if (isActive) {
                localStorage.removeItem("user");
                removeCookie('auth_token');
                window.dispatchEvent(new Event('authChange'));
                router.push('/');
              }
            } catch (e) {
              console.error("Error during logout:", e);
              if (isActive) {
                router.push('/');
              }
            }
          }
        }, 300);

      } catch (e) {
        console.error("Error processing logout:", e);
        if (isActive) {
          router.push('/');
        }
      }
    };

    performLogout();

    // Cleanup function
    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router]);

  return (
    <div className="bg-black text-white h-screen flex justify-center items-center text-2xl">
      Goodbye!
    </div>
  );
}
