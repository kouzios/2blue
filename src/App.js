import React from "react";
import Routes from './Routes';
import './App.css';
import { IDContextProvider } from './scripts/id-context';

const App = () => {
  return(
    <IDContextProvider>
      <Routes/>
    </IDContextProvider>
  )
}

export default App;