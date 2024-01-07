export const getPositions = () => {
    return {
        Top: {
            name: 'Top',
            image : '/images/positions/top.svg',
        },
        Jungle: {
            name: 'Jungle',
            image : '/images/positions/jungle.svg',
        },
        Mid: {
            name: 'Mid',
            image : '/images/positions/mid.svg',
        },
        ADC: {
            name: 'ADC',
            image : '/images/positions/bot.svg',
        },
        Support: {
            name: 'Support',
            image : '/images/positions/support.svg',
        },
    }
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min); 
    max = Math.floor(max); 
    let result = Math.floor(Math.random() * (max - min + 1)) + min; 
    return result;
} 