import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

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

    return(
        <Card>
          {secondSide !== null ?
            <div>
              {/** If a flipped card is asking for a zoom-in, only zoom in on the flipped side */}
              {props.flipped === true ?
                <img className="mtg-overlay" src={secondSide} alt={title+" side 2"}/> : null
              }

              {props.flipped === false ?
                <img className="mtg-overlay" src={firstSide} alt={title}/> : null
              }

              {/**If a flipped card has no flipped attribute (aka: only text, not a card with flip overlay button) */}
              {props.flipped === undefined ?
                <div>
                  <img className="mtg-overlay" src={firstSide} alt={title}/>
                  <img className="mtg-overlay" src={secondSide} alt={title+" side 2"}/>
                </div>: null
              }
            </div>
          :
          <img className="mtg-overlay" src={firstSide} alt={title}/>
          }
        </Card>
    )
}

export default MTGCardOverlay;

