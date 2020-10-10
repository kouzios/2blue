import React, { useState, createContext } from "react";

export const ProfileContext = createContext();

export const ProfileContextProvider = (props) => {
    const [profileInfo, setProfileInfo] = useState({email:null, image:null, name: null});
  
    return (
      <ProfileContext.Provider value={[profileInfo, setProfileInfo]}>
        {props.children}
      </ProfileContext.Provider>
    );
  };