
// Ask server for Current time and set Session variable

Meteor.setInterval(function(){
	Meteor.call("getServerTime", function(error, result){
		var market = Markets.findOne({});
		Session.set("currentTime", result);
	});
}, 1000);

// Track Market changes:

Tracker.autorun(function(){

	var market = Markets.findOne({});
	console.log('market ', market);
			now = Session.get("currentTime");

			console.log("now, ", now);

	// Check if openHour has String value
	if (_.isString(market.openHour)) {
		console.log('checking open');
		
		var openHour = Number(market.openHour.substr(0, market.openHour.indexOf(':'))),
				openMinutes = Number(market.openHour.substr(market.openHour.indexOf(':'))),
				openTime = new Date();

				openTime.setHours(openHour);
				openTime.setMinutes(openMinutes);

		if (now > openTime) {
			Markets.update(market, { $set: { state: "open" } });
			console.log('opening');
		}

	}

	if (_.isString(market.closeHour)) {
		console.log('chekcing close');
		var closeHour = Number(market.closeHour.substr(0, market.closeHour.indexOf(':'))),
				closeMinutes = Number(market.closeHour.substr(market.closeHour.indexOf(':'))),
				closeTime = new Date();

				closeTime.setHours(closeHour);
				closeTime.setMinutes(closeMinutes);

		if (now > closeTime) {
			Markets.update(market, { $set: { state: "close" } });
			console.log('closing');
		}
	}
});
