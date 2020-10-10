import React from "react";
import Routes from './Routes';
import './App.css';
import { IDContextProvider } from './scripts/id-context';
import { ProfileContextProvider } from './scripts/profile-context';
import { SignedinContextProvider } from './scripts/signedin-context';

const App = () => {
  return(
    <IDContextProvider>
      <ProfileContextProvider>
        <SignedinContextProvider>
          <Routes/>
        </SignedinContextProvider>
      </ProfileContextProvider>
    </IDContextProvider>
  )
}

export default App;