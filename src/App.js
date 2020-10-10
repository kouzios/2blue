import React from "react";
import Routes from './Routes';
import './App.css';
import { IDContextProvider } from './scripts/id-context';
import { ProfileContextProvider } from './scripts/profile-context';

const App = () => {
  return(
    <IDContextProvider>
      <ProfileContextProvider>
        <Routes/>
      </ProfileContextProvider>
    </IDContextProvider>
  )
}

export default App;