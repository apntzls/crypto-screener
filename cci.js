// CCI = (Typical Price  -  N-period SMA of TP) / (.015 x Mean Deviation)
// Typical Price (TP) = (High + Low + Close)/3
// Constant = .015

// There are four steps to calculating the Mean Deviation: 
// First, subtract the most recent N-period average of the typical price from each period's typical price. 
// Second, take the absolute values of these numbers. 
// Third, sum the absolute values. 
// Fourth, divide by the total number of periods (N). 

const mean = require('./mean')

module.exports = function calculateCCI(candles) {
    const CONSTANT = .015
    const typicalPrices = candles.map(calculateTypicalPrice)
    const lastTP = typicalPrices[typicalPrices.length - 1]
    const smaTP = mean(typicalPrices)
    const typicalSum = typicalPrices.reduce((acc, tp) => {
        acc += Math.abs(smaTP - tp);
        return acc
    }, 0)

    const meanDeviation = typicalSum / typicalPrices.length
    return (lastTP - smaTP) / (CONSTANT * meanDeviation)
}

function calculateTypicalPrice(interval) {
    return (Number(interval.high) + Number(interval.low)+ Number(interval.close)) / 3
}

