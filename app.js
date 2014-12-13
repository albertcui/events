var Twit = require('twit'),
    CartoDB = require('cartodb'),
    config = require('./config.js'),
    nyc = [-74,40,-73,41]
    //ny_place_id = "27485069891a7938"

var T = new Twit({
    consumer_key:         config.twitter_key,
    consumer_secret:      config.twitter_secret,
    access_token:         config.twitter_token,
    access_token_secret:  config.twitter_token_secret
})

var C = new CartoDB({
	user: 					config.cartodb_user,
	api_key: 				config.cartodb_api_key 
})

// C.on('connect', function() {
//     C.query("INSERT INTO {table}(name) VALUES('test') limit 5", {table: 'tweets'}, function(err, data){
//         console.log(err)
//         console.log(data)
//     })
// })

// C.connect()

var stream = T.stream('statuses/filter', { locations: nyc })

stream.on('tweet', function (tweet) {
    console.log(JSON.stringify(tweet, null, 10))
    process.exit()
})