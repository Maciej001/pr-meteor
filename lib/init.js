Meteor.startup(function(){
	_.mixin({
	  capitalize: function(string) {
	    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	  }
	});

	Date.prototype.getMinutesTwoDigits = function() {
		var minutes = this.getMinutes();
		if (minutes < 10) 
			return "0" + minutes.toString();
		else 
			return minutes.toString();
	}
});


