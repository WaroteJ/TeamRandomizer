import React, { useEffect, useState } from 'react';
import data from '../data/players.json';
import styled from 'styled-components';
import { getPositions } from '../utils/utils';
import PlayerEdit from './PlayerEdit';

const PlayerList = () => {
    const [players, setPlayers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [addPlayerOpen, setAddPlayerOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const positions = getPositions();
    useEffect(() => {
        setPlayers(data);
    }, []);

    const handleDeletePlayer = async (index) => {
        const res = await fetch('/api/deletePlayer', {
            method: 'POST',
            body: JSON.stringify({ id: players[index].id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        console.log(data);
        const newPlayers = [...players];
        newPlayers.splice(index, 1);
        setPlayers(newPlayers);
    }

    const closePlayerEdit = () => {
        setAddPlayerOpen(false);
        setSelectedPlayer(null);
    }

    return (
        <>
            <Sidebar>
                <PlayerListToggle $isSidebarOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? 'X' : '→'}</PlayerListToggle>
                <PlayerListContainer $isSidebarOpen={isSidebarOpen}>
                    <PlayerListHeader>Player List</PlayerListHeader>
                    <Players>
                        {players.map((player, index) => (
                            <PlayerListItem key={index}>
                                <PlayerName>{player.name}</PlayerName>
                                <PlayerPosition>{player.position}</PlayerPosition>
                                <div>
                                    <PlayerUpdateButton onClick={() => {
                                            setSelectedPlayer(player);
                                            setAddPlayerOpen(true);
                                        }}>
                                        Edit
                                    </PlayerUpdateButton>
                                    <PlayerDeleteButton onClick={() => handleDeletePlayer(index)}>Delete</PlayerDeleteButton>
                                </div>
                            </PlayerListItem>
                        ))}
                    </Players>
                    <PlayerAddButton onClick={() => setAddPlayerOpen(true)}>Add Player</PlayerAddButton>
                </PlayerListContainer>
            </Sidebar>
            <PlayerEdit playerData={selectedPlayer} isOpened={addPlayerOpen} close={closePlayerEdit} />
        </>
    );
};

export default PlayerList;


//Create style components for the PlayerList component
// Path: components/PlayerList.js

 const Sidebar = styled.div`
    position: absolute;
    display: block;
    height: 100vh;
`;

//Should be a sidebar in desktop view, and full width in mobile view (closable)

const PlayerListContainer = styled.div`
    min-height: 100vh;
    padding: ${props => props.$isSidebarOpen ? '1rem' : '0px'};
    min-width: ${props => props.$isSidebarOpen ? '375px' : '0px'};
    width: ${props => props.$isSidebarOpen ? '100%' : '0px'};

    transition: all 0.3s ease-in-out;
    overflow: hidden;
    position: relative;
    background-color: ${props => props.theme.backgroundColorSecondary};
    color: ${props => props.theme.textColor};
    border-color: ${props => props.theme.borderColor};

    @media (min-width: 1024px) {
        width: ${props => props.$isSidebarOpen ? '375px' : '0px'};
        position: fixed;
        top: 0;
        left: 0;
    }
`;

const PlayerListToggle = styled.button`
    position: absolute;
    top: 1rem;
    z-index: 100;
    left: ${props => props.$isSidebarOpen ? '345px' : '-1px'};
    transition: all 0.3s ease-in-out;
    font-size: 1.5rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${props => props.theme.textColor};

    ${props => !props.$isSidebarOpen && `
        //Will be a button stuck to the left side of the screen, need to have a bg color etc.
        background-color: ${props.theme.backgroundColorSecondary};
        border: 1px solid ${props.theme.borderColor};
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        padding: 0.25rem 0.5rem;
    `}
`;

const PlayerListHeader = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0.5rem 0;
    color: ${props => props.theme.textColor};
`;

const Players = styled.ul`
    padding: 0;
`;

const PlayerListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid ${props => props.theme.borderColorSecondary};
`;

const PlayerName = styled.span`
    font-weight: bold;
    width: 75px;
    text-overflow: ellipsis;
    color: ${props => props.theme.textColor};
`;

const PlayerPosition = styled.span`
    font-size: 0.75rem;
    color: ${props => props.theme.textColorSecondary};
    text-transform: uppercase;
    width: 75px;
`;

const PlayerUpdateButton = styled.button`
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: transparent;
    cursor: pointer;
    color: ${props => props.theme.textColor};
    transition: all 0.3s ease-in-out;
    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
`;

const PlayerDeleteButton = styled.button`
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: transparent;
    cursor: pointer;
    color: ${props => props.theme.textColor};
    transition: all 0.3s ease-in-out;
    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
`;

const PlayerAddButton = styled.button`
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: transparent;
    cursor: pointer;
    color: ${props => props.theme.textColor};
    transition: all 0.3s ease-in-out;
    &:hover {
        background-color: ${props => props.theme.hoverColor};
    }
`;

const PlayerFormContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    color: ${props => props.theme.textColor};
`;
