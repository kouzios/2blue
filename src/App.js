import React, {useState, useEffect} from "react";
import Decks from './views/Decks';
import Decklist from './views/Decklist';
import Home from './views/Home';
import './App.css';

const App = () => {
  const [view, setView] = useState("home");
  const [deckID, setDeckID] = useState(null);

  useEffect(() => {
    redirect();
    //eslint-disable-next-line
  }, [view]);

  const openDecklist = (id) => {
    setDeckID(id);
    setView("decklist");
  }

  const redirect = () => {
    switch (view) {
      case "home": return <Home setView={setView}/>;
      case "decks": return <Decks openDecklist={openDecklist}/>;
      case "decklist": return <Decklist id={deckID} setView={setView}/>;
      default: return <Home/>;
    }
  }

  return (
    <div>
      {redirect()}
      <hr/>
      <div className="clickable" onClick={() => setView("home")}> Go Home </div>
    </div>
  );
}

export default App;