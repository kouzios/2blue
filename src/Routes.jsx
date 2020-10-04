import React, {useState, useEffect, useContext } from "react";
import { IDContext } from './scripts/id-context';
import Decks from './views/Decks';
import Decklist from './views/Decklist';
import Home from './views/Home';
import CreateDeck from './views/CreateDeck';
import {Row, Col, Button} from 'react-bootstrap';

const Routes = () => {
    const [userID, setUserID] = useContext(IDContext);
    const [view, setView] = useState(window.location.pathname.split("/")[1]);
    const [params, setParams] = useState("");
    const [deckID, setDeckID] = useState(null);
    const [signedIn, setSignedIn] = useState(false);
    const [profileInfo, setProfileInfo] = useState({email:null, image:null, name: null});
  
    useEffect(() => {
      redirect();
      //eslint-disable-next-line
    }, [view]);
  
    useEffect(() => {
      initiateSigninButton();
    }, [])
  
    const initiateSigninButton = () => {
      try {
        window.gapi.signin2.render("google-sign-in-button", {
          width: 200,
          height: 50,
          onsuccess: onSignIn
        });
      } catch(err) {
        console.error(err);
      }
    }
  
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
        default: return <Home setView={setView}/>;
      }
    }
  
    function signOut() {
      let auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        setSignedIn(false);
        initiateSigninButton();
      });
    }
  
    const onSignIn = async (googleUser) => {
      const id_token = googleUser.getAuthResponse().id_token;
      setUserID(id_token);//TODO: Wait to let users view decks til this isn't -1
      const profile = googleUser.getBasicProfile();
      const user = {
        email:  profile.getEmail(),
        image: profile.getImageUrl(),
        name: profile.getName(),
      };
  
      const res = await fetch('/api/signin', {method:'POST', body: JSON.stringify({id_token, user})});
      if(res.status === 200) {
        setProfileInfo(user);
        setSignedIn(true);
      } else {
        console.log("Authentication failed");
        signOut();
      }
    }
  
    return (
      <div>
        <Row id="header">
          <Col>
            <img className="clickable banner-logo" src="logo_long.png" alt="Banner logo" onClick={()=>setView("home")}/>
          </Col>
          <Col>
            {
              signedIn 
              ?
              <Button id="google-sign-out-button" onClick={signOut}>Sign Out</Button>
              :
              
              <div id="google-sign-in-button" data-onsuccess="onSignIn">more</div>
            }
          </Col>
        </Row>
        <hr/>
        {redirect()}
        <hr/>
        <div className="clickable" onClick={() => setView("home")}> Go Home </div>
      </div>
    );
  }

export default Routes;