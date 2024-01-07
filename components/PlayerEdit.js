import React, { useEffect, useState } from 'react';
import { getPositions } from '../utils/utils';
import styled from 'styled-components';

const PlayerEdit = ({ playerData, isOpened, close }) => {
    const [name, setName] = useState('');
    const [mainPosition, setMainPosition] = useState('');
    const [bannedPosition, setBannedPosition] = useState('');
    const positions = getPositions();

    useEffect(() => {
        setName(playerData ? playerData.name : '');
        setMainPosition(playerData ? playerData.mainPosition : '');
        setBannedPosition(playerData ? playerData.bannedPosition : '');
    }, [playerData]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (playerData) {
            let tmpPlayer = { ...playerData };
            tmpPlayer.name = name;
            tmpPlayer.mainPosition = mainPosition;
            tmpPlayer.bannedPosition = bannedPosition;

            const res = await fetch('/api/updatePlayer', {
                method: 'PUT',
                body: JSON.stringify(tmpPlayer),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            console.log(data);
            close();            
        } else {
            const res = await fetch('/api/addPlayer', {
                method: 'POST',
                body: JSON.stringify({ name, mainPosition, bannedPosition }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await res.json();
            console.log(data);
            close();
        }
    };

    return (
        <>
        <PlayerEditBg $isOpened={isOpened} onClick={() => close()} />
        <PlayerEditContainer $isOpened={isOpened}>
            <PlayerEditClose onClick={() => close()}>x</PlayerEditClose>
            <PlayerEditHeader>{playerData ? 'Edit Player' : 'Create Player'}</PlayerEditHeader>
            <PlayerEditBody>
                <PlayerLabel htmlFor="name">Name</PlayerLabel>
                <PlayerInput
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <PlayerLabel htmlFor="mainPosition">Main Position</PlayerLabel>
                <PlayerSelect
                    id="mainPosition"
                    name="mainPosition"
                    value={mainPosition}
                    onChange={(e) => setMainPosition(e.target.value)}
                >
                    <option value="">Select a position</option>
                    {positions && Object.values(positions).map((position) => (
                        <option key={position.name} value={position.name}>
                            {position.name}
                        </option>
                    ))}
                </PlayerSelect>

                <PlayerLabel htmlFor="bannedPosition">Banned Position</PlayerLabel>
                <PlayerSelect
                    id="bannedPosition"
                    name="bannedPosition"
                    value={bannedPosition}
                    onChange={(e) => setBannedPosition(e.target.value)}
                >
                    <option value="">Select a position</option>
                    {positions && Object.values(positions).map((position) => (
                        <option key={position.name} value={position.name}>
                            {position.name}
                        </option>
                    ))}
                </PlayerSelect>
                <PlayerSubmit type="submit" onClick={handleSubmit}>
                    {playerData ? 'Update' : 'Create'}
                </PlayerSubmit>
            </PlayerEditBody>
        </PlayerEditContainer>
        </>
    );
};

export default PlayerEdit;

// Path: components/PlayerList.js
//create styled components for the PlayerEdit component

const PlayerEditContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: ${(props) => (props.$isOpened ? '1' : '0')}; 
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 300px;
    background-color: ${(props) => props.theme.backgroundColorSecondary};
    color: ${(props) => props.theme.textColor};
    z-index: 1000;

    display: ${(props) => (props.$isOpened ? 'block' : 'none')};
`;

const PlayerEditBg = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.5);
    display: ${(props) => (props.$isOpened ? 'block' : 'none')};
    pointer-events: ${(props) => (props.$isOpened ? 'auto' : 'none')};
    z-index: 999;
`;

const PlayerEditClose = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    padding: 5px;
    margin: 5px;
    color: ${(props) => props.theme.textColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 5px;
    background-color: ${(props) => props.theme.backgroundColor};

    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
    }
`;

const PlayerEditHeader = styled.div`
    display: flex;
    justify-content: space-between;
`;

const PlayerEditBody = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlayerLabel = styled.label`
    color: ${(props) => props.theme.textColor};
`;

const PlayerInput = styled.input`
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.textColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
`;

const PlayerSelect = styled.select`
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.textColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
`;


const PlayerSubmit = styled.button`
    background-color: ${(props) => props.theme.backgroundColor};
    color: ${(props) => props.theme.textColor};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 5px;
    padding: 5px;
    margin: 5px;

    &:hover {
        background-color: ${(props) => props.theme.hoverColor};
        cursor: pointer;
    }
`;