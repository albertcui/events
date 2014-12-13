var Twit = require('twit'),
    CartoDB = require('cartodb'),
    config = require('./config.js'),
    express = require('express'),
    path = require('path'),
    db = require('monk')("mongodb://localhost/tweets"),
    tweets = db.get('tweets'),
    nyc = [-74,40,-73,41],
    app = express(),
    port = 8080
    //ny_place_id = "27485069891a7938"

var T = new Twit({
    consumer_key:         config.twitter_key,
    consumer_secret:      config.twitter_secret,
    access_token:         config.twitter_token,
    access_token_secret:  config.twitter_token_secret
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade');


app.route('/').get(function(req, res) {
  res.render('index')
})

function getTweets() {
            console.log("getting tweets")
            T.get('trends/place', { id: 2459115 }, function(err, data, response) {
            data[0].trends.forEach(function(t){
                console.log(t);
                T.get('search/tweets', {q: t.query, geocode: "40.772777,-73.952519,25mi", count:100}, function(err, data, response) {
                    data.statuses.forEach(function(tweet) {
                        if (tweet.geo && tweet.geo.coordinates) {
                            tweets.insert(tweet)
                        } else {
                            console.log("no coordinates")
                        }
                    })
                })
            })
        })
}

getTweets()
setInterval(getTweets, 5 * 60 * 1000)

app.listen(port, function() {
    console.log("[WEB] listening on port 8080")
})