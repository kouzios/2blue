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
import Loading from './views/Loading';

const Routes = () => {
  const [profileInfo] = useContext(ProfileContext);
  const [signedIn] = useContext(SignedinContext);
  const [view, setView] = useState((document.location.pathname).slice(1));
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

  //TODO: Big tasks
  //Homepage signed in restyle
  //View decks restyle
  //View decklist restyle
  //Fix horizontal scrolling
  //at least slightly fix mobile
  //SCSS for each page?
  //Create color scheme
  //MTG card integration
  //Start a game
  //add iconography
  //Make seperate prop from Decks to show all decks
  //Alter color scheme of Home page (not just blue, white, add one more color?)

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
      window.history.pushState("", "", '/loading');
      return <Loading/>;
    }

    const params = window.location.search;
    window.history.pushState("", "", '/' + view + params);
    switch (view) {
      case "home": return <Home setView={setView}/>;
      case "welcome": return <Welcome />
      case "decks": return <Decks total="100" openDecklist={openDecklist}/>;
      case "decklist": return <Decklist id={deckID} setView={setView}/>;
      case "create": return <CreateDeck setView={setView}/>;
      case "profile": return <Profile profileInfo={profileInfo} setView={setView}/>;
      default: return <Home setView={setView}/>;
    }
  }

  const setSignedInView = (path, params) => {
    //If at welcome screen, move to home screen. Else, keep status quo
    if(path === "welcome" ) { 
      setView("home");
    } else {
      window.history.pushState("", "", '/' + view + params);
      setView(path)
    }
  }

  return (
    <div>
      <Header setSignedInView={setSignedInView} setView={setView}/>
      { route }
      <div>Footer</div>
    </div>
  );
}

export default Routes;