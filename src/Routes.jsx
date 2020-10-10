import React, {useState, useEffect, useContext } from "react";
import { IDContext } from './scripts/id-context';
import { ProfileContext } from './scripts/profile-context';
import { SignedinContext } from './scripts/signedin-context';
import Decks from './views/Decks';
import Decklist from './views/Decklist';
import Home from './views/Home';
import Profile from './views/Profile';
import CreateDeck from './views/CreateDeck';
import Header from './components/Header';
import Welcome from './views/Welcome';

const Routes = () => {
  const [userID, setUserID] = useContext(IDContext);
  const [profileInfo, setProfileInfo] = useContext(ProfileContext);
  const [signedIn] = useContext(SignedinContext);
  const [view, setView] = useState(window.location.pathname.split("/")[1]);
  const [deckID, setDeckID] = useState(null);
  
  useEffect(() => {
    redirect();
    //eslint-disable-next-line
  }, [view]);//TODO: On history back or forward, setView!!!!!!
  
  const openDecklist = (id) => {
    window.history.pushState("", "", '/' + view + "?id="+id);
    setDeckID(id);
    setView("decklist");
  }

  const redirect = () => {
    const params = window.location.search;
    window.history.pushState("", "", '/' + view + params);
    switch (view) {
      case "home": return (signedIn ? <Home setView={setView}/> : <Welcome/>);
      case "decks": return <Decks openDecklist={openDecklist}/>;
      case "decklist": return <Decklist id={deckID} setView={setView}/>;
      case "create": return <CreateDeck setView={setView}/>;
      case "profile": return <Profile profileInfo={profileInfo} setView={setView}/>;
      default: return <Home setView={setView}/>;
    }
  }

  return (
    <div>
      <Header setView={setView}/>
      {redirect()}
    </div>
  );
}

export default Routes;