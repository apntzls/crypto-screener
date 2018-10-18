// 1. Work out the Mean (the simple average of the numbers)
// 2. Then for each number: subtract the Mean and square the result
// 3. Then work out the mean of those squared differences.
// 4. Take the square root of that and we are done!

const mean = require('./mean')

module.exports = function(values) {
    const step1 = mean(values)
    const step2 = values.map((v) => Math.pow(v - step1, 2))
    const step3 = mean(step2)
    // step4
    return Math.sqrt(step3)
}