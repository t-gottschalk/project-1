const mongoose = require('mongoose');
const Price = require('./../models/Price.js');
const axios = require('axios');
const fs = require('fs');
let currencies = [ 'BTC', 'ETH', 'RPX', 'DOGE' ]; // Currencies in ticker symbols

let now = new Date(); // first find the start of today in unix time
let mins = new Date( now.getFullYear(), now.getMonth(), now.getDate(),now.getHours(), now.getMinutes() )/60000;
let lastFive = mins-(mins%5);
let unixTime = lastFive*60;
let lastDay = [ unixTime ]; // begin an array of this week's unix dates
for( var i = 0; i < (12*24); i++ ){ // populate the last week array
    unixTime -= 300;
    lastDay.unshift(unixTime);
}

const fetchTicker = async tickerSymbol => { // fetches and saves prices for provided symbol starting from index
    url = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + tickerSymbol
    
    //using a map with Promise.all dispatches all requests concurrently and maintains the order  
    let prices = await Promise.all(lastDay.map(timeStamp => 
       axios.get(url + `&tsyms=USD,EUR&ts=${timeStamp}`)
       .then(res => {// when the request is done
            let data = res.data; // convert response to json
            console.log(data);
            var price = { // prepare the price for db entry
                currency: tickerSymbol.toString(),
                price: data[tickerSymbol].USD,
                date: timeStamp
            };
            return price;
            // price.save
            // .then(() => console.log("New price auto fetched for: "+ res._doc.currency + " date: " + Date(res._doc.date) ))
            // .catch(err => console.log(`ERROR:\n\n ${err}`));                
        })
        .catch(err => {
            throw err
        })
    ));
    return prices;
}

const fetchAlltickers = () => {
    let currencyIndex = 0;
    let fetchInterval = setInterval( () => {  // loop through currencies at an interval due to API request limits
        var currentTicker = currencies[currencyIndex]
        fetchTicker(currentTicker)
        .then(prices =>
            prices.forEach(price =>
                fs.writeFile(JSON.stringify(price),() => console.log(price))
            )
        )
        .catch(err => console.log(`failed to fetch prices for ${currentTicker}, error:\n${err}`))
        if( currencyIndex === currencies.length-1 ){ clearInterval( fetchInterval ); } //ckear interval
        currencyIndex++;
    } ,1000);
}


module.exports = {
    doAll: fetchAlltickers,
    lastDay : lastDay
}