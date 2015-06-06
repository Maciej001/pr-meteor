Meteor.publish('prices', function(){
	return Prices.find();
});

Meteor.publish('statistics', function(){
	return Statistics.find({}, {limit: 1});
});

Meteor.publish('accounts', function(){
	return Accounts.find();
});