
// Ask server for Current time and set Session variable

Meteor.setInterval(function(){
	Meteor.call("getServerTime", function(error, result){
		Session.set("currentTime", result);
	});
}, 1000);
