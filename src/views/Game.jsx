import React, {useState, useEffect} from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const defaultLife = 40;

const defaultPlayer = {
    "name": "Player",
    "commander": "",
    "status": {
        "life": defaultLife,
        "poison": 0,
        "commander_damage": []
    },
    "cards": [],
};

const Profile = ({setView, ...props}) => {
    const [players, setPlayers] = useState([]);
    const [playersView, setPlayersView] = useState(null);

    useEffect(() => {
        formatPlayers();
        //eslint-disable-next-line
    }, [players])

    const formatCommanderDamages = (damages, player_index) => (
        damages.map((specific_damage, index) => (
            <div key={"damage"+index+"_"+player_index}>
                <Col>
                <span>{players[index].commander}: {specific_damage}</span>
                </Col>
            </div>
        ))
    )

    const formatStatus = (status, player_index) => (
        <div>
            <Col>Life: {status.life}</Col>
            <Col>Poison: {status.poison}</Col>
            <Col>Commander Damages: {formatCommanderDamages(status.commander_damage, player_index)}</Col>
        </div>
    );

    const formatPlayers = () => {
        setPlayersView(
            players.map((player, index) => (
                <div className="mb-2" key={"player"+index}>
                    <Col>Name: {player.name}</Col>
                    <Col>Status: {formatStatus(player.status, index)}</Col>
                    <Col>Cards: {player.cards}</Col>
                </div>
            ))
        );
    }

    const addPlayer = () => { //TODO: Alter other players commander damage
        const playersClone = [...players];
        playersClone.push(defaultPlayer);
        setPlayers(playersClone);
    }

    const hardReset = () => {
        setPlayers([]);
    }

    const softReset = () => {//TODO: Do something about commander damage
        const resetPlayers = players.map((player) => (defaultPlayer));
        setPlayers(resetPlayers);
    }

    const config = () => {//TODO: Config settings like default life, # of players maybe, format type, etc
        alert("TODO")
    }

    return (
        <div id="game">
            <Row id="control-panel" className="justify-content-center">
                <Button onClick={()=>addPlayer()}>Add Player</Button>
                <Button onClick={()=>softReset()}>Reset Game</Button>
                <Button onClick={()=>hardReset()}>Hard Reset</Button>
                <Button onClick={()=>config()}>Config</Button>
            </Row>
            {playersView}
        </div>
    );
}

export default Profile;
