import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

const MTGCard = ({removeCard, title, ...props}) => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        getCard();
    }, [])

    const getCard = async () => {
        // var Origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        
        const res = await fetch('/api/cards?title=' + title);
        const img = await res.json()
        setImageURL(img);
    }

    return(
        <Card className="mtg">
            <img className="mtg" src={imageURL} alt={title}/>
            <Button className="delete" variant="danger" onClick={()=>removeCard()}>X</Button>
        </Card>
    )
}

export default MTGCard;

