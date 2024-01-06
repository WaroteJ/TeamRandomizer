import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import playersData from '../data/players.json';
import { getPositions, getRandomInt } from '../utils/utils';

const PlayerComp = () => {
    const [allPlayers, setAllPlayers] = useState([]);
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [reload, setReload] = useState(false);
    const positions = getPositions(); 

    useEffect(() => {
        // Load players from players.json
        setAllPlayers(playersData);
    }, []);

    useEffect(() => {
        // Filter out players that have already been added to the team comp (use id to compare)
        let tmpAvailablePlayers = allPlayers.filter((player) => !players.some((p) => p.id === player.id));
        //Sort players by name
        tmpAvailablePlayers.sort((a, b) => a.name.localeCompare(b.name));
        setAvailablePlayers(tmpAvailablePlayers);
    }, [allPlayers, players]);

    useEffect(() => {
        //Remove players that have been removed from the team comp
        const newPlayers = [...players];
        newPlayers.forEach((player, index) => {
            if (!allPlayers.some((p) => p.id === player.id)){
                newPlayers.splice(index, 1);
            }
        });
        setPlayers(newPlayers);
    }, [allPlayers]);

    const randomizePositions = () => {
        if (reload)
            return;
        setReload(true);
        let availablePositions = {...positions};
        //remove locked positions from availablePositions
        let nbLockedPlayers = 0;
        let tmpPlayers = [...players];
        console.log(tmpPlayers);

        tmpPlayers.forEach((player) => {
            if (player.isLocked){
                delete availablePositions[player.randomizedPosition];
                nbLockedPlayers++;
            }
        });

        let cpt = 0;
  
        tmpPlayers.forEach((player, index) => {
            //if player is locked, skip
            if (player.isLocked)
                return;
            //generate a random position between 0 and 4 - index
            let randomPosition = getRandomInt(0, 4 - cpt - nbLockedPlayers);
            console.log(Object.keys(availablePositions), randomPosition, Object.keys(availablePositions)[randomPosition]);
            //availablePositions is an object
            player.randomizedPosition = Object.keys(availablePositions)[randomPosition];
            delete availablePositions[player.randomizedPosition];
            cpt++;
        });

        //sort players by randomizedPosition in order top, jgl, mid, adc, supp
        tmpPlayers.sort((a, b) => {
            return Object.keys(positions).indexOf(a.randomizedPosition) - Object.keys(positions).indexOf(b.randomizedPosition);
        })
        //delay to allow css transition to take place

        setPlayers(tmpPlayers);
        setTimeout(() => {
            setReload(false);
        }, 500);
    };

    const Player = (position, key) => {
        let currentPlayer = players.find((player) => player.randomizedPosition === position);

        return (
            <TeamCompListItem key={key} $reload={reload && currentPlayer && !currentPlayer.isLocked} $nthChild={key}>
                <TeamCompPosition>
                    {position}
                    {currentPlayer && (
                    <TeamCompPositionLock $isLocked={currentPlayer.isLocked}
                        onClick={() => {
                            if (currentPlayer.randomizedPosition){
                                const newPlayers = [...players];
                                let index = newPlayers.findIndex((player) => player.randomizedPosition === position);
                                newPlayers[index].isLocked = !newPlayers[index].isLocked;
                                setPlayers(newPlayers);
                            }
                        }}>
                        Lock
                    </TeamCompPositionLock>
                    )}
                </TeamCompPosition>
                {currentPlayer && currentPlayer.name && (
                    <>
                        <TeamCompName>{currentPlayer.name}</TeamCompName>
                            <TeamCompButton
                            onClick={() => {
                                const newPlayers = [...players];
                                let index = newPlayers.findIndex((player) => player.randomizedPosition === position);
                                newPlayers.splice(index, 1);
                                setPlayers(newPlayers);
                            }}
                        >
                            Remove
                        </TeamCompButton>
                     </>
                )}
            </TeamCompListItem>
        );
    };

    return (
        <TeamCompContainer>
            <TeamComp>
                <TeamCompHeader>Team Comp</TeamCompHeader>
                <TeamCompList>
                    {/* {players.map((player, index) => (
                        <TeamCompListItem key={index} $reload={reload} $nthChild={index}>
                            <TeamCompName>{player.name}</TeamCompName>
                            {player.randomizedPosition && (
                            <TeamCompPosition>
                                {player.randomizedPosition}
                                <TeamCompPositionLock $isLocked={player.isLocked}
                                    onClick={() => {
                                        if (player.randomizedPosition){
                                            const newPlayers = [...players];
                                            newPlayers[index].isLocked = !newPlayers[index].isLocked;
                                            setPlayers(newPlayers);
                                        }
                                    }}>
                                        Lock
                                    </TeamCompPositionLock>
                            </TeamCompPosition>
                            )}
                            <TeamCompButton
                                onClick={() => {
                                    const newPlayers = [...players];
                                    newPlayers.splice(index, 1);
                                    setPlayers(newPlayers);
                                }}
                            >
                                Remove
                            </TeamCompButton>
                        </TeamCompListItem>
                    ))} */}

                    {positions && Object.keys(positions).map((position, index) => (
                        Player(position, index)
                    ))}
                </TeamCompList>
            </TeamComp>
            <TeamCompAvailablePlayers>
                {players.length > 1 && (
                    <TeamCompButton
                        onClick={() => {
                            randomizePositions()
                        }}
                    >
                        Randomize
                    </TeamCompButton>
                )}
                <TeamCompAvailablePlayersHeader>Available Players</TeamCompAvailablePlayersHeader>
                <TeamCompAvailablePlayersList>
                    {availablePlayers.map((player, index) => (
                        <TeamCompAvailablePlayersListItem key={index}>
                            <TeamCompAvailablePlayersName>{player.name}</TeamCompAvailablePlayersName>
                            <TeamCompButton
                                onClick={() => {
                                    if (players.length >= 5)
                                        return;
                                    const newAvailablePlayers = [...availablePlayers];
                                    newAvailablePlayers.splice(index, 1);
                                    setAvailablePlayers(newAvailablePlayers);
                                    //find available position
                                    let availablePositions = {...positions};
                                    let tmpPlayers = [...players];
                                    tmpPlayers.forEach((player) => {
                                        delete availablePositions[player.randomizedPosition];
                                    });
                                    let randomPosition = Object.keys(availablePositions)[0];
                                    player.randomizedPosition = randomPosition;
                                    setPlayers([...players, player]);
                                }}
                                disabled={players.length >= 5}
                            >
                                Add
                            </TeamCompButton>
                        </TeamCompAvailablePlayersListItem>
                    ))}
                </TeamCompAvailablePlayersList>
            </TeamCompAvailablePlayers>
        </TeamCompContainer>
    );

};

export default PlayerComp;

//styled components for PlayerComp, should be centered on the page

const TeamCompContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
`;

const TeamComp = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TeamCompHeader = styled.h1`
    font-size: 2rem;
    margin-bottom: 2rem;
`;

const TeamCompList = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    min-height: 10rem;
`;

const TeamCompListItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
    overflow: hidden;
    max-height: ${props => props.$reload ? 0 : '10rem'};
    transition: ${props => props.$reload ? 'max-height 0s ease-in-out' : 'max-height 0.5s ease-in-out'};
    transition-delay: ${props => props.$reload ? '0s' : `${props.$nthChild * 0.40}s`};
`;  

const TeamCompName = styled.span`
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const TeamCompPosition = styled.span`
    font-size: 1rem;
    margin-bottom: 1rem;
`;  

const TeamCompPositionLock = styled.button`
    font-size: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    color: ${props => props.theme.textColor};
    border: 1px solid ${props => props.theme.borderColor};
    background-color: ${props => props.$isLocked ? props.theme.hoverColor : 'transparent'};
    cursor: pointer;
    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
`;

const TeamCompButton = styled.button`
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: transparent;
    cursor: pointer;
    margin-bottom: 1rem;
    color: ${props => props.theme.textColor};
    margin-left: .5rem;
    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
    &:disabled {
        cursor: not-allowed;
        background-color: ${props => props.theme.disabledColor};
        color: ${props => props.theme.textColor};
        border: 1px solid ${props => props.theme.disabledColor};
`;

const TeamCompAvailablePlayers = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TeamCompAvailablePlayersHeader = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 1rem;
`;

const TeamCompAvailablePlayersList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const TeamCompAvailablePlayersListItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;  

const TeamCompAvailablePlayersName = styled.span`
    font-size: 1rem;
    margin-bottom: 1rem;
`;

