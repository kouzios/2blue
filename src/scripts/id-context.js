import React, { useState, createContext } from "react";

export const IDContext = createContext();

export const IDContextProvider = (props) => {
    const [userID, setUserID] = useState("-1");
  
    return (
      <IDContext.Provider value={[userID, setUserID]}>
        {props.children}
      </IDContext.Provider>
    );
  };