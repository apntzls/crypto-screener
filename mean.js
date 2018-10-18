module.exports = function(values) {
    const sum = values.reduce((acc,val) => {
        acc += val
        return acc
    }, 0)
    return sum / values.length
}