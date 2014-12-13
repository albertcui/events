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

var stream = T.stream('statuses/filter', { locations: nyc })

C.on('connect', function() {
    T.get('trends/place', { id: 2459115 }, function(err, data, response) {
        data.trends.forEach(function(t){
            T.get('search/tweets', {q: t.query, geocode: [40.772777, -73.952519, 25]}, function(err, data, response){
                console.log(data)
            })
        })
    })
// 	stream.on('tweet', function (tweet) {
// 		console.log(tweet);
// 		if (tweet.geo && tweet.geo.coordinates) {
// 			C.query(
// 				"INSERT INTO {table} (display_name, tweet_id, text, latitude, longitude, user_avatar) \
// 			    VALUES('{display_name}', {tweet_id}, '{text}', {latitude}, {longitude}, '{user_avatar}') ",
// 			    {
// 			    	table: 'tweets',
// 			    	display_name: tweet.user.screen_name,
// 			    	tweet_id: tweet.id_str,
// 			    	text: tweet.text, 
// 			    	latitude: tweet.geo.coordinates[0], 
// 			    	longitude: tweet.geo.coordinates[1],
// 			    	user_avatar: encodeURI(tweet.user.profile_image_url)
// 			    },
// 			    function(err, data){
// 			        console.log(err)
// 			        console.log(data)

// 			        if (tweet.entities.hashtags) {
// 						tweet.entities.hashtags.forEach (function(hashtag) {
// 							C.query(
// 								"INSERT INTO {table}(tweet_id, hashtag) VALUES({tweet_id},'{hashtag}')",
// 							    {
// 							    	table: 'tweets_hashtag', 
// 							    	tweet_id: tweet.id_str, 
// 							    	hashtag: hashtag.text
// 							    },
// 							    function(err, data){
// 							        console.log(err)
// 							        console.log(data)
// 							        process.exit()
// 							    }
// 					    	)
// 					    })
// 					}
// 			    }
// 	    	)
// 		} else {
// 			console.log("no coordinates")
// 		}
// 	})

})

C.connect()



