import React, {useState, useEffect, useContext } from "react";
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
  const [profileInfo] = useContext(ProfileContext);
  const [signedIn] = useContext(SignedinContext);
  const [view, setView] = useState(window.location.pathname.split("/")[1]);
  const [deckID, setDeckID] = useState(null);
  const [route, setRoute] = useState(null);
  
  useEffect(() => {
    routing();
    //eslint-disable-next-line
  }, [view]);

  //On back/forward history event, change DOM accordingly
  window.onpopstate = function(event) {
    const path = (document.location.pathname).slice(1);
    setView(path);
  }

  //TODO: Big tasks before "true" deploy
  //Homepage signed in restyle
  //View decks restyle
  //View decklist restyle
  //Make welcome page welcoming
  //Netlify doesn't let you alter url manually? Check netlify.toml
  //Fix horizontal scrolling
  //at least slightly fix mobile

  const openDecklist = (id) => {
    window.history.pushState("", "", '/' + view + "?id="+id);
    setDeckID(id);
    setView("decklist");
  }

  const routing = () => {
    setRoute(determineRoute());
  }

  const determineRoute = () => {
    if(!signedIn) {
      window.history.pushState("", "", '/welcome');
      return <Welcome/>;
    }

    const params = window.location.search;
    window.history.pushState("", "", '/' + view + params);
    switch (view) {
      case "home": return <Home setView={setView}/>;
      case "welcome": return <Welcome />
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
      { route }
    </div>
  );
}

export default Routes;