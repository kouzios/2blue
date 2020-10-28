import React, {useState} from 'react';
import CustomPanel from '../components/CustomPanel';
import MTGCard from '../components/MTGCard';
import { Row, Button } from 'react-bootstrap';

const defaultBoard = [//TODO: Store using cookies?
    
]

const defaultGraveyard = [//TODO: Store using cookies?
    
]

const Profile = ({setView, ...props}) => {
    const [board, setBoard] = useState(defaultBoard);
    const [graveyard, setGraveyard] = useState(defaultGraveyard);

    const addCard = async (title) => {
        const cardName = prompt("What card would you like to add to " + title + "?");
        const res = await fetch("/api/cards?title=" + cardName, {method: "POST"});
        const cardInfo = await res.json();
        if(cardInfo.name) {
            if(title === "Board") {
                let clone = [...board];
                clone.push(<MTGCard key={title+cardInfo.name+clone.length} title={cardInfo.name}/>);
                setBoard(clone);
            } else {
                let clone = [...graveyard];
                clone.push(<MTGCard key={title+cardInfo.name+clone.length} title={cardInfo.name}/>);
                setGraveyard(clone);
            }
        }
    }

    const hardReset = () => {
        setBoard(defaultBoard);
        setGraveyard(defaultGraveyard);
    }

    const config = () => {//TODO: Toggleable graveyard, if removed makes board larger ; also =?
        alert("TODO")
    }

    return (
        <div id="game">
            <Row className="justify-content-center">
                <CustomPanel md={6} title="Control Panel">
                    <Button onClick={()=>hardReset()}>Hard Reset</Button>
                    <Button className="disabled" disabled onClick={()=>config()}>Config</Button>
                </CustomPanel>
            </Row>

            <Row className="ml-2 mr-2 justify-content-around">
                <CustomPanel addable addCard={addCard} md={6} title="Board">
                    {board}
                </CustomPanel>

                <CustomPanel addable addCard={addCard} md={6} title="Graveyard">
                   {graveyard}
                </CustomPanel>
            </Row>
        </div>
    );
}

export default Profile;
