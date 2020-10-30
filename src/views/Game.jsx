import React, { useState, useEffect } from 'react';
import CustomPanel from '../components/CustomPanel';
import MTGCard from '../components/MTGCard';
import { Row, Button } from 'react-bootstrap';

//TODO: Store using cookies?
const defaultBoard = new Set();
const defaultGraveyard = new Set();

const Game = ({setView, ...props}) => {
    const [board, setBoard] = useState(defaultBoard);
    const [displayBoard, setDisplayBoard] = useState(null);
    const [graveyard, setGraveyard] = useState(defaultGraveyard);
    const [displayGraveyard, setDisplayGraveyard] = useState(null);

    useEffect(() => {
        let clone = [...board];
        const location = "board";
        clone = clone.map((card, index) => (
            <MTGCard removeCard={(status)=>removeCard(location, card, status)} key={location+card+index} title={card}/>
        ));
        setDisplayBoard(clone);
    }, [board]);
    
    useEffect(() => {
        let clone = [...graveyard];
        const location = "graveyard";
        clone = clone.map((card, index) => (
            <MTGCard removeCard={(status)=>removeCard(location, card, status)} key={location+card+index} title={card}/>
        ));
        setDisplayGraveyard(clone);
    }, [graveyard]);

    const removeCard = (location, cardName, optionalStatus) => {
        //If we have a status code (from adding, getting a status code, then removing as a result) then...
        if(optionalStatus && typeof(optionalStatus) === 'number') {
            switch(optionalStatus) {
                case 404:
                    alert("Error, card does not exist in Scryfall's database");
                    break;
                default:
                    alert(optionalStatus + " error: From TwoBlue's server");
                    break;
            }
                
        }
        if(location === "board") { 
            let clone = new Set([...board]);
            clone.delete(cardName);
            setBoard(clone);
        } else if(location === "graveyard") {
            let clone = new Set([...graveyard]);
            clone.delete(cardName);
            setGraveyard(cardName);
        } else {
            alert("Failed to remove card");
        }
    }

    const addCard = async (location) => {
        const cardName = prompt("What card would you like to add to " + location.toUpperCase() + "?");

        if(cardName) {
            //Convert to lowercase, no special characters to ensure consistency for the Set preventing duplicates
            const condensedCardName = (cardName.toLowerCase()).replace(/[^\w\s]/gi, '');
            if(location === "board") {
                setBoard(new Set([...board, condensedCardName]));
            } else if(location === "graveyard") {
                setGraveyard(new Set([...graveyard, condensedCardName]));
            } else {
                alert("Invalid card insert location");
            }
        }
    }

    const hardReset = () => {
        console.log("RESETTING")
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
                    <Button onClick={hardReset}>Hard Reset</Button>
                    <Button className="disabled" disabled onClick={config}>Config</Button>
                </CustomPanel>
            </Row>

            <Row className="ml-2 mr-2 justify-content-around">
                <CustomPanel addable addCard={addCard} md={6} title="board">
                    {displayBoard}
                </CustomPanel>

                <CustomPanel addable addCard={addCard} md={6} title="graveyard">
                   {displayGraveyard}
                </CustomPanel>
            </Row>
        </div>
    );
}

export default Game;
