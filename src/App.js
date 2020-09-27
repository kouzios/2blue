import React, {useState, useEffect} from "react";
import Decks from './views/Decks';
import Decklist from './views/Decklist';
import Home from './views/Home';
import Button from 'react-bootstrap/Button';
import './App.css';

const App = () => {
  const [view, setView] = useState("home");
  const [deckID, setDeckID] = useState(null);

  useEffect(() => {
    redirect();
    //eslint-disable-next-line
  }, [view]);

  useEffect(() => {
    window.gapi.signin2.render("google-sign-in-button", {
      width: 200,
      height: 50,
      onsuccess: onSignIn
    });
  })

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

  function signOut() {
    var auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }

  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  return (
    <div>
      <div id="google-sign-in-button" data-onsuccess="onSignIn"/>
      <Button id="google-sign-out-button" onClick={signOut}>Sign Out</Button>
      <hr/>
      {redirect()}
      <hr/>
      <div className="clickable" onClick={() => setView("home")}> Go Home </div>
    </div>
  );
}

export default App;