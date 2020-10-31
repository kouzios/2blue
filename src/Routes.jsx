import React, {useState, useEffect, useContext } from "react";
import { SignedinContext } from './scripts/signedin-context';
import Decks from './views/Decks';
import Decklist from './views/Decklist';
import Home from './views/Home';
import Profile from './views/Profile';
import CreateDeck from './views/CreateDeck';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './views/Welcome';
import Loading from './views/Loading';
import Game from './views/Game';


const Routes = () => {
  const [signedIn] = useContext(SignedinContext);
  const [view, setView] = useState(null);
  const [deckID, setDeckID] = useState(null);
  const [route, setRoute] = useState(null);
  
  const HomeComponent = () => <Home openDecklist={openDecklist} setView={setView}/>;

  useEffect(() => {
    routing();
    //eslint-disable-next-line
  }, [view]);

  //On back/forward history event, change DOM accordingly
  window.onpopstate = (event) => {
    const path = (document.location.pathname).slice(1);
    if(signedIn === false) {
      setView("welcome");
    } else if(signedIn === true && path === "welcome") {
      setView("home");
    } else {
      setView(path);
    }
  }

  //TODO: Big tasks before using link in job applications
  //at least slightly fix mobile
  //add iconography
  //maybe localstorage signin, then replace it when google gets back to us? "you've been logged out" screen if local = in, google = out
  //on any 401, send back to Welcome
  //pop state goign to decklists needs to occur multiple times which is bad
  //add something else to hero page, something under maybe?
  //in start game import your own deck for various usages? (Tutoring for example)
  //Make add card immediately add, then remove if not valid?
  //hover card to see larger
  //img flipping
  //config
  //store saved cards via cookie
  //change alert error handling to state-based
  //success messages
  //decklists:
  // Sorting
  // Change mode b/w text and image (sorted by cmc?)
  // Stats (colors, types, etc)


  const openDecklist = (id) => {
    window.history.pushState("", "", '/' + view + "?id="+id);
    setDeckID(id);
    setView("decklist");
  }

  const routing = () => {
    setRoute(determineRoute());
  }

  const determineRoute = () => {
    if(!view) {
      window.history.pushState("", "", '/loading');
      return <Loading/>;
    }

    if(view === "loading") {
      window.history.pushState("", "", '/home');
      return HomeComponent();
    }

    if(view === "welcome" && signedIn === true) {
      window.history.pushState("", "", '/home');
      return HomeComponent();
    }
  
    const params = (view === "decklist" ? window.location.search : ""); //Only want params on decklist right now
    window.history.pushState("", "", '/' + view + params);
    switch (view) {
      case "home": return HomeComponent();
      case "welcome": return <Welcome />;
      case "decks": return <Decks openDecklist={openDecklist}/>;
      case "decklist": return <Decklist id={deckID} setView={setView}/>;
      case "create": return <CreateDeck setView={setView}/>;
      case "profile": return <Profile setView={setView}/>;
      case "game": return <Game setView={setView}/>
      default: return HomeComponent();
    }
  }

  const setSignedInView = (path, params) => {
    //If at welcome screen, move to home screen. Else, keep status quo
    if(path === "welcome" || path === "loading" || !path) { 
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
      { signedIn ? <Footer setView={setView}/> : null }
    </div>
  );
}

export default Routes;