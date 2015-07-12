Meteor.publish('allUsers', function(){
	return Meteor.users.find({});
});

Meteor.publish('prices', function(){
	return Prices.find({ state: 'active' });
});

Meteor.publish('active-prices', function(){
	return Prices.find({ state: 'active' });
});

Meteor.publish('all-prices', function(){
	return Prices.find({});
});

Meteor.publish('bids', function(){
	return Bids.find({ state: 'active' });
});

Meteor.publish('offers', function(){
	return Offers.find({ state: 'active' });
});

Meteor.publish('trades', function(){
	return Trades.find({});
});

Meteor.publish('statistics', function(){
	return Statistics.find({}, { limit: 1 });
});

Meteor.publish('portfolios', function(){
	return Portfolios.find({});
});

Meteor.publish('markets', function(){
	return Markets.find({}, { limit: 1 });
});
