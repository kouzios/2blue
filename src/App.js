import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Decks from './views/Decks';
import Decklist from './views/Decklist';
import './App.css';

export default function App() {
  return (
    <Router>
      <Switch>
          <Route path="/decks">
            <Decks />
            <Link to="/">Go back?</Link>
          </Route>
          <Route path="/decklist">
            <Decklist/>
            <Link to="/decks">Go back?</Link>
          </Route>
          <Route path="/">
            <Link to="/decks">Go to decks?</Link>
          </Route>
          <Route path="*">
            <div>Bad Route</div>
          </Route>
        </Switch>
    </Router>
  );
}