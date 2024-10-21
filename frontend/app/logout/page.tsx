"use client"

import {useEffect, useState} from 'react';
import {logoutUser} from "@/app/services/userService";
import {useRouter} from 'next/navigation';
import {removeCookie} from "@/app/utils/cookieUtils";
import {UserRequestDto} from "@/app/types/user";

export default function LogoutPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(true); // State to manage logout message
  let [username, setUsername] = useState(''); // State for storing username

  const userRequestDto: UserRequestDto = {
    credentials: {
      username: "",
      password: ""
    },
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      admin: false
    },
    token: ''
  }

  useEffect(() => {
    let user = localStorage.getItem("user") as string;
    let parsedUser = JSON.parse(user); // Parse the user string to JSON object

    userRequestDto.credentials.username = parsedUser.username;
    userRequestDto.profile = parsedUser.profile;
    console.log("userrequestdto: {}",userRequestDto);

    try {
      // Display logging out message for 2 seconds before redirecting
      setTimeout(() => {
        logoutUser(userRequestDto).then(r => console.log(r));
        localStorage.removeItem("user");
        removeCookie('auth_token')
        router.push('/');
      }, 300);
    } catch (e) {
      console.log("caught error in logout page")
      console.error(e);
    }
  }, [router]);

  if (loggingOut) {
    return (
      <div style={{
        backgroundColor: 'black',
        color: 'white',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px'
      }}>
        Goodbye!
      </div>
    );
  }

  return null; // The page won't display anything else during logout
}
