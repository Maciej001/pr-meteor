// Ask server for Current time and set Session variable
Meteor.setInterval(function(){
	Meteor.call("getServerTime", function(error, result){
		Session.set("currentTime", result);
	});
}, 1000);


Meteor.subscribe('markets', function(){
	Tracker.autorun(function(){

		var market = Markets.findOne(),
		now = new Date(TimeSync.serverTime());
		var openTime, closeTime;

		if(_.isString(market.openHour)) {
			openTime = Meteor.call("getDateFromTimeString", market.openHour);
		}

		if (_.isString(market.closeHour)) 
			Meteor.call("getDateFromTimeString", market.closeHour, function(err, result){
				closeTime = result;
			});


		// Open market if not opened yet and now is after opening and before closing time
		if (market.state === "closed" && now >= openTime && now < closeTime)  {
			Markets.update(market._id, { $set: { state: "open" } });
		}

		// Close market if market was open and closing time passed
		if (market.state === "open" && now >= closeTime ) {
			Markets.update(market._id, { $set: { state: "closed" } });
		}
		
	}); // autorun ends

});



