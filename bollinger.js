const mean = require('./mean')
const std = require('./standard_deviation')

module.exports = function(values, times = 2) {
    const average = mean(values)
    const deviation = std(values)
    
    const low = average - (deviation * times)
    const middle = average
    const high = average + (deviation * times)
    return { low, middle, high }
}