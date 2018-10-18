const binance   = require('binance-api-node').default()
const bollinger = require('./bollinger')
const cci       = require('./cci')
const fs        = require('fs');

/*
This node script outputs https://www.tradingview.com/ watchlists
And is the start of a trading algorithm I will implement once the strategy is fully developed
I'm using this to identify long trending trades on the 1 hour, 4 hour and daily timeframes

The basis of this strategy was derived from trader and author Mark Whistler
*/

const intervals = ["1h", "4h", "1d"];

binance.exchangeInfo()
.then((exchange) => {
    exchange.symbols.forEach((data) => {
        if (data.quoteAsset == 'BTC') {
            intervals.forEach((i) => {
                const fileName = `${i}_binance.txt`
                fs.createWriteStream(fileName)
                
                binance.candles({ symbol: data.symbol, interval: i, limit: 200 })
                .then((values) => {
                    // If symbol does not have enough market data discard
                    if (values.length >= 200) {
                        const CCI_200 = cci(values)
                        const CCI_14 = cci(values.slice(values.length - 14))

                        const closes = values.map((v) => Number(v.close))
                        const lastClose = closes[closes.length - 1]
                        const bollinger_200 = bollinger(closes, 1.25)
                        const bollinger_50 = bollinger(closes.slice(closes.length - 50), 1.25)

                        // These conditions indicate there is long trending 
                        // The 14 period CCI moving back over the -100 pivot indicates positive momentum and is my buy signal
                        if (
                            bollinger_50.high > bollinger_200.high 
                            && lastClose > bollinger_50.low
                            && CCI_14 < -90
                        ) {
                            appendSymbolTo(data.symbol, fileName)
                        }
                    }
                })
                .catch(console.error)
            })
        }
    })
})

function appendSymbolTo(symbol, file) {
    const newLine= "\r\n";
    const field =  `BINANCE:${symbol}`
 
    fs.appendFile(file, field + newLine, throwError);
}

function throwError(err) {
    if (err) throw err
}