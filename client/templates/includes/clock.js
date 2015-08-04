
// Ask server for Current time and set Session variable

Meteor.setInterval(function(){
	Meteor.call("getServerTime", function(error, result){
		Session.set("currentTime", result);
	});
}, 1000);

Meteor.subscribe('markets', function(){
	Tracker.autorun(function(){
		var market = Markets.findOne(),
		now = Session.get("currentTime");

		if(_.isString(market.openHour)) {
		
			var openHour = Number(market.openHour.substr(0, market.openHour.indexOf(':'))),
					openMinutes = Number(market.openHour.substr(market.openHour.indexOf(':') + 1)),
					openTime = new Date();

					openTime.setHours(openHour);
					openTime.setMinutes(openMinutes);
					openTime.setSeconds(0);
					openTime.setMilliseconds(0);
		} // openingHour

		if (_.isString(market.closeHour)) {
			var closeHour = Number(market.closeHour.substr(0, market.closeHour.indexOf(':'))),
					closeMinutes = Number(market.closeHour.substr(market.closeHour.indexOf(':') + 1)),
					closeTime = new Date();

					closeTime.setHours(closeHour);
					closeTime.setMinutes(closeMinutes);
					closeTime.setSeconds(0);
					closeTime.setMilliseconds(0);
		} // closing Hour

		// Open market if not opened yet and now is after opening and before closing time
		if (market.state === "closed" && now >= openTime && now < closeTime)  {
			Markets.update(market._id, { $set: { state: "open" } });
		}

		// Close market if market was open and closing time passed
		if (market.state === "open" && now >= closeTime ) {
			Markets.update(market._id, { $set: { state: "closed" } });
		}
		
	}); // autorun ends
}); // subscribe ends


