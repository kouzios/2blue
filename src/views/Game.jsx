import React, {useState} from 'react';
import CustomPanel from '../components/CustomPanel';
import MTGCard from '../components/MTGCard';
import { Row, Card, Button } from 'react-bootstrap';

const defaultBoard = [
    <MTGCard title="Counterspell"/>,
    <MTGCard title="Reclamation Sage"/>,
    <MTGCard title="Wood Elves"/>,
    <MTGCard title="LLanowar Elves"/>,
]

const defaultGraveyard = [
    <MTGCard title="Demonic Tutor"/>,
    <MTGCard title="Opt"/>,
    <MTGCard title="Search for Azcanta"/>,
    <MTGCard title="Vances Blasting Cannons"/>,
    <MTGCard title="Sol Ring"/>,
    <MTGCard title="Command Tower"/>,
    <MTGCard title="Commanders Sphere"/>,
]

const Profile = ({setView, ...props}) => {
    const [board, setBoard] = useState(defaultBoard);
    const [graveyard, setGraveyard] = useState(defaultGraveyard);

    const addCard = () => {
        alert("TODO")
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
                    <Button onClick={()=>addCard()}>Add Card</Button>
                    <Button onClick={()=>hardReset()}>Hard Reset</Button>
                    <Button onClick={()=>config()}>Config</Button>
                </CustomPanel>
            </Row>

            <Row className="ml-2 mr-2 justify-content-around">
                <CustomPanel md={6} title="Board">
                    {board}
                </CustomPanel>

                <CustomPanel md={6} title="Graveyard">
                   {graveyard}
                </CustomPanel>
            </Row>
        </div>
    );
}

export default Profile;
