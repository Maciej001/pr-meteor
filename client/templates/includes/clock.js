// Ask server for Current time and set Session variable
Meteor.setInterval(function(){
		var now = new Date();
		Session.set("currentTime", now);
		checkMarketState();
}, 1000);

function checkMarketState() {
	Meteor.subscribe('markets', function(){

			var market = Markets.findOne(),
					openingTime, closingTime,
					now = new Date(),
					timezoneOffset = now.getTimezoneOffset();

			now.setHours(now.getHours() + timezoneOffset/60);

			if(_.isDate(market.openingHour)) 
				openingTime = market.openingHour;

			if (_.isDate(market.closingHour)) 
				closingTime = market.closingHour;

			// Open market if not opened yet and now is after opening and before closing time
			if (openingTime && closingTime)
				if (market.state === "closed" && now >= openingTime && now < closingTime)  {
					Markets.update(market._id, { $set: { state: "open" } });
				}

			// Close market if market was open and closing time passed
			if (closingTime)
				if (market.state === "open" && now >= closingTime ) {
					Markets.update(market._id, { $set: { state: "closed" } });
				}

	});
}


