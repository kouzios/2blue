import React, { useState, createContext } from "react";

export const SignedinContext = createContext();

export const SignedinContextProvider = (props) => {
    const [signedIn, setSignedIn] = useState(false);
  
    return (
      <SignedinContext.Provider value={[signedIn, setSignedIn]}>
        {props.children}
      </SignedinContext.Provider>
    );
  };