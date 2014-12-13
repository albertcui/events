var Twit = require('twit'),
    CartoDB = require('cartodb'),
    config = require('./config.js')
    //ny_place_id = "27485069891a7938"

var T = new Twit({
    consumer_key:         config.twitter_key,
    consumer_secret:      config.twitter_secret,
    access_token:         config.twitter_token,
    access_token_secret:  config.twitter_token_secret
})

var nyc = [-74,40,-73,41]

var stream = T.stream('statuses/filter', { locations: nyc })

stream.on('tweet', function (tweet) {
  
})