import React, {useState, useEffect} from 'react';
import { Col } from 'react-bootstrap';

const defaultPlayers = [
    {
        "name": "Player 1",
        "commander": "fblthp",
        "status": {
            "life": 40,
            "poison": 0,
            "commander_damage": [0, 0]
        },
        "cards": ["island"],
    },
    {
        "name": "Player 2",
        "commander": "fblthp",
        "status": {
            "life": 40,
            "poison": 0,
            "commander_damage": [0, 0]
        },
        "cards": ["island", "fblthp"],
    },
]

const Profile = ({setView, ...props}) => {
    const [players, setPlayers] = useState(defaultPlayers);
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

    return (
        <div id="game">
            {playersView}
        </div>
    );
}

export default Profile;
