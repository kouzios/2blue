import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';

const MTGCard = ({removeCard, title, ...props}) => {
    const [imageURL, setImageURL] = useState(null);

    useEffect(() => {
        getCard();
    }, [])

    const getCard = async () => {        
        const res = await fetch('/api/cards?title=' + title);
        const status = res.status;
        if(status !== 200) { //Delete card if invalid
            removeCard(status);
            return;
        }
        const img = await res.json()
        setImageURL(img);
    }

    return(
        <Card className="mtg">
            <img src={imageURL} alt={title}/>
            <Button className="delete" variant="danger" onClick={removeCard}>X</Button>
        </Card>
    )
}

export default MTGCard;

