var EventSearch = require("./"),
	_ = require ('lodash'),
	argv = require ('optimist').argv,
	usage = 'node test.js --lat=40.4503 --lng=-3.6949 --distance=25000 --keyword="Nightlife"';

if (!argv.lat) {
	console.error ('Give me a latitude\n', usage);
	process.exit (1);
}

if (!argv.lng) {
	console.error ('Give me a longtitude\n', usage);
	process.exit (1);
}

if (!argv.distance) {
	console.error ('Give me a distance\n', usage);
	process.exit (1);
}

// if (!argv.keyword) {
// 	console.error ('Give me a keyword\n', usage);
// 	process.exit (1);
// }

var es = new EventSearch({
    "lat": argv.lat,
    "lng": argv.lng,
    "accessToken": 'EAAVAHwPSzO8BADq002S1Jp2u0KU1ty81VIs5Y0Ge3M60uSbNJMV9qM9hJMIldtnT0ICh8CLZAEmtvBAaJygAMgEqFZCeW6Fz3bKE16xXdMyviRDzu41qXSkDIr9f0vPPeqV8aos6RwaVpgnVgrMTMqkTzb4aQZD',
    "distance": argv.distance,
    "query": argv.keyword
});

es.search()
	.then(function (results) {
		var filtered = _.filter (results.venues, function (result) {
			if (!result.events) return false;
			var firstEvent = _.first (result.events.data);

			if (!firstEvent) return false;

			var start_time = new Date (firstEvent.start_time);

			return start_time.getTime () >= Date.now ();
		});

		console.log (
			_.map (filtered, function (venue) {
				return [venue.id, venue.name].join ('\t');
			})
				.join ('\n')
		);
	})
	.catch(function (error) {
	    console.error(error);
	});
