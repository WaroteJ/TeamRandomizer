export const getPositions = () => {
    return {top: 'Top', jgl: 'Jungle', mid: 'Mid', adc: 'ADC', supp: 'Support'};
}

export const getRandomInt = (min, max) => {
    min = Math.ceil(min); 
    max = Math.floor(max); 
    let result = Math.floor(Math.random() * (max - min + 1)) + min; 
    return result;
} 