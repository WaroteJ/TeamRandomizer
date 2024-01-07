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
            let playerIndex = allPlayers.findIndex((p) => p.id === player.id);

            if (playerIndex === -1){
                newPlayers.splice(index, 1);
            } else {
                //update player name, mainPosition and bannedPosition
                newPlayers[index].name = allPlayers[playerIndex].name;
                newPlayers[index].mainPosition = allPlayers[playerIndex].mainPosition;
                newPlayers[index].bannedPosition = allPlayers[playerIndex].bannedPosition;
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
        let bannedPositions = [];
        let ignoreBan = false;

        tmpPlayers.forEach((player) => {
            if (player.isLocked){
                delete availablePositions[player.randomizedPosition];
                nbLockedPlayers++;
            } else {
                //if player is not locked, reset randomizedPosition
                player.randomizedPosition = null;
            }
            if (player.bannedPosition)
                bannedPositions.push(player.bannedPosition);

        });
        
        //Players can have a banned position 
        //If there are 5 players and the same position is banned for all of them, we ignore the banned position
        if (bannedPositions.length > 0 && players.length === 5) {
            //if all players have the same banned position, ignore the banned position
            if (bannedPositions.every((val, i, arr) => val === arr[0])){
                ignoreBan = true;
            }
        }

        let newTmpPlayers = [...tmpPlayers];

        tmpPlayers.forEach((player, index) => {
            //if player is locked, skip
            if (player.isLocked)
                return;
            
            let availablePositionsCurrentPlayer = {...availablePositions};
            //remove banned positions from availablePositions
            if (!ignoreBan && player.bannedPosition){
                delete availablePositionsCurrentPlayer[player.bannedPosition];
            }
            //if availablePositionsCurrentPlayer is empty, it means that all positions are banned, try to switch with another player which is neither locked or with this position banned
            if (Object.keys(availablePositionsCurrentPlayer).length === 0){
                console.log('all positions are banned')
                //find a player which is neither locked or with this position banned
                let playersToSwitch = [];
                for (let i = 0; i < newTmpPlayers.length; i++){
                    if (!newTmpPlayers[i].isLocked && newTmpPlayers[i].bannedPosition !== player.randomizedPosition && newTmpPlayers[i].bannedPosition !== player.bannedPosition){
                        playersToSwitch.push(i);
                    }
                }
                //switch the two players with a random available one
                if (playersToSwitch.length > 0){
                    //get random player to switch
                    let playerToSwitch = playersToSwitch[getRandomInt(0, playersToSwitch.length - 1)];

                    let tmp = Object.keys(availablePositions)[0];
                    newTmpPlayers[index].randomizedPosition = newTmpPlayers[playerToSwitch].randomizedPosition;
                    newTmpPlayers[playerToSwitch].randomizedPosition = tmp;
                    return;
                } else {
                    
                    let randomPosition = getRandomInt(0,  Object.keys(availablePositions).length - 1);

                    newTmpPlayers[index].randomizedPosition = Object.keys(availablePositions)[randomPosition];
                    delete availablePositions[newTmpPlayers[index].randomizedPosition];
                }
            } else {
                //generate a random position between 0 and 4 - index
                let randomPosition = getRandomInt(0, Object.keys(availablePositionsCurrentPlayer).length - 1);
                //availablePositions is an object

                newTmpPlayers[index].randomizedPosition = Object.keys(availablePositionsCurrentPlayer)[randomPosition];
                delete availablePositions[newTmpPlayers[index].randomizedPosition];
            }
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
            <TeamCompListItem key={key} $reload={reload && (!currentPlayer || (currentPlayer && !currentPlayer.isLocked))} $nthChild={key}>
                <TeamCompPosition>
                    {positions[position].name}
                    <TeamCompImage src={positions[position].image} $isLocked={currentPlayer && currentPlayer.isLocked}
                        onClick={() => {
                        if (currentPlayer && currentPlayer.randomizedPosition){
                            const newPlayers = [...players];
                            let index = newPlayers.findIndex((player) => player.randomizedPosition === position);
                            newPlayers[index].isLocked = !newPlayers[index].isLocked;
                            setPlayers(newPlayers);
                        }
                    }}/>
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
                        <TeamCompButtonIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path opacity="1" fill="#1E3050" d="M274.9 34.3c-28.1-28.1-73.7-28.1-101.8 0L34.3 173.1c-28.1 28.1-28.1 73.7 0 101.8L173.1 413.7c28.1 28.1 73.7 28.1 101.8 0L413.7 274.9c28.1-28.1 28.1-73.7 0-101.8L274.9 34.3zM200 224a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM96 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 376a24 24 0 1 1 0-48 24 24 0 1 1 0 48zM352 200a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM224 120a24 24 0 1 1 0-48 24 24 0 1 1 0 48zm96 328c0 35.3 28.7 64 64 64H576c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H461.7c11.6 36 3.1 77-25.4 105.5L320 413.8V448zM480 328a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
                        </TeamCompButtonIcon>
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
                                <TeamCompButtonIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" $height={'20px'} $width={'20px'}>
                                    <path opacity="1" fill="#1E3050" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                                </TeamCompButtonIcon>
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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;  

//This is SVG image
const TeamCompImage = styled.img`
    width: 29px;
    height: 29px;
    padding: 2px;
    margin-left: .5rem;
    border-radius: 50%;
    background-color: ${props => props.$isLocked ? props.theme.hoverColor : 'transparent'};
    border: 1px solid ${props => props.theme.borderColor};
    cursor: pointer;
    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
`;

const TeamCompButton = styled.button`
    font-size: 1rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: transparent;
    cursor: pointer;
    margin-bottom: 1rem;
    color: ${props => props.theme.textColor};
    margin-left: .5rem;

    display: flex;
    justify-content: center;
    align-items: center;


    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
    &:disabled {
        cursor: not-allowed;
        background-color: ${props => props.theme.disabledColor};
        color: ${props => props.theme.textColor};
        border: 1px solid ${props => props.theme.disabledColor};
`;

//This is SVG image
const TeamCompButtonIcon = styled.svg`
    width: ${props => props.$width ? props.$width : '30px'};
    height: ${props => props.$height ? props.$height : 'auto'};
    
    path {
        fill : ${props => props.theme.textColor};
    }

    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
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