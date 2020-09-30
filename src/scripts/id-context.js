import React, { useState, createContext, useEffect } from "react";

export const IDContext = createContext();

export const IDContextProvider = (props) => {
    const [id, setID] = useState("-1");
  
    return (
      <IDContext.Provider value={[id, setID]}>
        {props.children}
      </IDContext.Provider>
    );
  };