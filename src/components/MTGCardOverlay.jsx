import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

const MTGCardOverlay = ({removeCard, title, ...props}) => {
    const [firstSide, setFirstSide] = useState(null);
    const [secondSide, setSecondSide] = useState(null);

    useEffect(() => {
        getCard();
        //eslint-disable-next-line
    }, [])

    const getCard = async () => {       
      const res = await fetch('/api/cards?title=' + title);
      const status = res.status;
      if(status !== 200) { //Delete card if invalid
          removeCard(status);
          return;
      }
      const img = await res.json()
      setFirstSide(img[0]);

      if(img[1]) {
        setSecondSide(img[1]);
      }
    }

    const render = () => {
      if(firstSide !== null) {
        if(secondSide !== null) {
          //Change which card side is featured based on parent prop
          if(props.flipped === true) {
            return <img className="mtg-overlay" src={secondSide} alt={title+" side 2"}/>;
          } 
          if(props.flipped === false) {
            return <img className="mtg-overlay" src={firstSide} alt={title}/>;
          }
        }
        return <img className="mtg-overlay" src={firstSide} alt={title}/>;
      }
      return null;
    }

    return(
        <Card>
          {render()}
        </Card>
    )
}

export default MTGCardOverlay;

