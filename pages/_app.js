import React from 'react';
import ReactDOM from 'react-dom';

import PlayerList from '../components/PlayerList';
import PlayerComp from '../components/PlayerComp';
import { ThemeProvider } from 'styled-components';
//import global styles
import '../styles/global.css';
import Head from 'next/head';

const theme = {
    //Create a theme color scheme for a dark mode / League of Legends theme (dark blue as main bg color)
    // primaryColor, secondaryColor, accentColor, backgroundColor, etc.
    primaryColor: '#1a1a1a',
    secondaryColor: '#d3d3d3',
    accentColor: '#8c5ece',
    backgroundColor: '#0e0e0e',
    backgroundColorSecondary: '#1c1c1c',
    textColor: '#aaa',
    textColorSecondary: '#8c5ece',
    borderColor: '#d3d3d3',
    borderColorSecondary: '#8c5ece',
    hoverColor: '#8c5ece',
    disabledColor: '#444',
};
  
export default function App() {
    return (
        <>
            <Head>
                <title>Toujours plus random</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <ThemeProvider theme={theme}>
                    <PlayerList />
                    <PlayerComp />
                </ThemeProvider>
            </main>
        </>

    );
}
