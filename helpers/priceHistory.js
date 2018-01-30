var mongoose = require('mongoose');
var Price = require('./../models/Price.js');
var https = require('https');

currencies = [ 'BTC', 'ETH', 'RPX', 'DOGE' ]; // Currencies in ticker symbols

var now = new Date(); // first find the start of today in unix time
var startOfDay = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
var unixTime = startOfDay / 1000;
var lastWeek = [ unixTime ]; // begin an array of this week's unix dates

function fetchPrices( tickerSymbol , index ) { // fetches and saves prices for provided symbol starting from index

    for( var k = index; k >= 0; k-- ){ // for each date in lastWeek beggining from the provided index
        var url = 'https://min-api.cryptocompare.com/data/pricehistorical?fsym=' + tickerSymbol + '&tsyms=USD,EUR&ts=' + lastWeek[k];

        https.get( url, function( res ){ // make a get request with the dynamic url
            res.setEncoding('utf8');
            var body = '';
            res.on('data', data => {
                body += data;
            });
        
            res.on('end', () => { // when the request is done
                body = JSON.parse(body); // convert response to json

                var price = new Price ({ // prepare the price for db entry
                    currency: tickerSymbol.toString(),
                    price: body[tickerSymbol].USD,
                    date: lastWeek[this]
                });
                
                price.save( function( err , res ){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("New price auto fetched for: "+ res._doc.currency + " date: " + Date(res._doc.date) );
                    }
                });
            })
        }.bind( k )); // bind the current date index
    };
    
}

for( var i = 0; i < 6; i++ ){ // populate the last week array
    unixTime -= 86400;
    lastWeek.push(unixTime);
}

var currencyIndex = 0;
var fetchInterval = setInterval( function(){  // loop through currencies at an interval due to API request limits

    var currentTicker = currencies[currencyIndex]
    
    var prices = Price.find( { currency : currentTicker }, function(err, data){ // get the newest price
        if(err) {
            console.log('Error: ' , err); 
        } else {
            
            if( data.length === 0 ){ // if no price history is found
                console.log('No prices found for: ' + this + ' fetching a new set from API' );
                fetchPrices( this , 6 ); // fetch and save all prices
            } else { // a price was found
                priceDate = data[0]._doc.date; // get the date of the returned newest price
                
                var startFrom = ( lastWeek.indexOf( priceDate ) - 1); // find the index to start fetching prices from
                
                if( startFrom >= 0 ){
                    fetchPrices( this , startFrom );
                } else {
                    console.log('all prices for '+ this +' are up to date');
                }
                
            }
            
        }
    }.bind( currentTicker ) ).sort({ date : -1 }).limit(1); // bind the current ticker symbol
    
    if( currencyIndex === currencies.length-1 ){ clearInterval( fetchInterval ); } // clear the interval

    currencyIndex++;
} ,1000);


module.exports = {
    lastWeek : lastWeek
}