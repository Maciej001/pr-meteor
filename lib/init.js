Meteor.startup(function(){
	_.mixin({
	  capitalize: function(string) {
	    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	  }
	});
});

// Return system time
if (Meteor.isServer) {
	Meteor.methods({
		getServerTime: function(){
			return new Date();
		}
	});
}