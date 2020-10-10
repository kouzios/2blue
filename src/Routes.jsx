import React, {useState, useEffect, useContext } from "react";
import { IDContext } from './scripts/id-context';
import { ProfileContext } from './scripts/profile-context';
import Decks from './views/Decks';
import Decklist from './views/Decklist';
import Home from './views/Home';
import Profile from './views/Profile';
import CreateDeck from './views/CreateDeck';
import Header from './components/Header';

const Routes = () => {
  const [userID, setUserID] = useContext(IDContext);
  const [view, setView] = useState(window.location.pathname.split("/")[1]);
  const [deckID, setDeckID] = useState(null);
  const [profileInfo, setProfileInfo] = useContext(ProfileContext);
  
  useEffect(() => {
    redirect();
    //eslint-disable-next-line
  }, [view]);
  
  const openDecklist = (id) => {
    window.history.pushState("", "", '/' + view + "?id="+id);
    setDeckID(id);
    setView("decklist");
  }

  const redirect = () => {
    const params = window.location.search;
    window.history.pushState("", "", '/' + view + params);
    switch (view) {
      case "home": return <Home setView={setView}/>;
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
      <hr/>
      <div className="clickable" onClick={() => setView("home")}> Go Home </div>
    </div>
  );
}

export default Routes;