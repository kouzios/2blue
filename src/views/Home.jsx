import React from 'react';

const Home = ({...props}) => {
  return (
    <div className="container mt-5">
      <div className="clickable" onClick={() => props.setView("decks")}>View list of decks here</div>
    </div>
  );
}

export default Home;
