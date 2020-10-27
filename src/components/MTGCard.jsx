import React, {useEffect, useState} from 'react';
import {Card} from 'react-bootstrap';

const MTGCard = ({title, ...props}) => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        getCard();
    }, [])

    const getCard = async () => {
        const URL = 'https://api.scryfall.com/cards/named?exact=' + title + '&format=image';
        var Origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        
        const res = await fetch(
            URL, 
            {Origin, cache: "force-cache"}
        );

        setImageURL(res.url);
    }

    return(
        <Card className="mtg">
            <img className="mtg" src={imageURL} alt={title}/>
        </Card>
    )
}

export default MTGCard;

