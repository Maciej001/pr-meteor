Meteor.publish('prices', function(){
	return Prices.find({state: 'active'});
});

Meteor.publish('statistics', function(){
	return Statistics.find({}, {limit: 1});
});

Meteor.publish('accounts', function(user_id){
	return Accounts.find({userId:'YKXKs5tGZFX9qhAc4 '});
});

