Meteor.publish('prices', function(){
	return Prices.find();
});