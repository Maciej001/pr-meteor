Meteor.startup(function(){
	_.mixin({
	  capitalize: function(string) {
	    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	  }
	});
});

// Return server time
if (Meteor.isServer) {
	Meteor.methods({
		getServerTime: function(){
			return new Date;
		},
	});
}

Meteor.methods({
	// Translates "11:30" into Date object
	getDateFromTimeString: function(time){
		var hour = Number(time.substr(0, time.indexOf(':'))),
		minutes = Number(time.substr(time.indexOf(':') + 1)),
		new_time = new Date();

		new_time.setHours(hour);
		new_time.setMinutes(minutes);
		new_time.setSeconds(0);
		new_time.setMilliseconds(0);

		return new_time;
	}
});



