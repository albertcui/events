var Twit = require('twit'),
    CartoDB = require('cartodb'),
    config = require('./config.js'),
    app = require('express'),
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

var stream = T.stream('statuses/filter', { locations: nyc })

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade');


app.route('/').get(function(req, res) {
  res.render('index')
})

C.on('connect', function() {
    T.get('trends/place', { id: 2459115 }, function(err, data, response) {
        data[0].trends.forEach(function(t){
        	console.log(t);
            T.get('search/tweets', {q: t.query, geocode: "40.772777,-73.952519,25mi", count:100}, function(err, data, response) {
                data.statuses.forEach(function(tweet) {
                	if (tweet.geo && tweet.geo.coordinates) {
						C.query(
							"INSERT INTO {table} (trend, display_name, tweet_id, text, latitude, longitude, user_avatar) \
						    VALUES('{trend}', '{display_name}', {tweet_id}, '{text}', {latitude}, {longitude}, '{user_avatar}') ",
						    {
						    	table: 'tweets',
						    	trend: t.name.replace("#", ""),
						    	display_name: tweet.user.screen_name,
						    	tweet_id: tweet.id_str,
						    	text: tweet.text,
						    	latitude: tweet.geo.coordinates[0],
						    	longitude: tweet.geo.coordinates[1],
						    	user_avatar: encodeURI(tweet.user.profile_image_url)
						    },
						    function(err, data){
						        console.log(err)
						        console.log(data)
						    }
						)
					} else {
						console.log("no coordinates")
					}
                })
            })
        })
    })
})

C.connect()

app.listen(port, function() {
    logger.info("[WEB] listening on port %s", port)
})



