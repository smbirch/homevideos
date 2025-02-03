"use client"

import {User} from "@/app/types/user";

export const getLocalUserData = () => {
  let userData;
  if (typeof window !== "undefined") {
    userData = localStorage.getItem("user");
  }
  if (userData) {
    console.log(userData);
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
    }
  } else {
    return null;
  }
};
