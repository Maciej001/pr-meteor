Meteor.publish('prices', function(){
	return Prices.find({ state: 'active' });
});

Meteor.publish('bids', function(){
	return Bids.find({ state: 'active' });
});

Meteor.publish('offers', function(){
	return Offers.find({ state: 'active' });
});

Meteor.publish('trades', function(){
	return Trades.find();
});

Meteor.publish('statistics', function(){
	return Statistics.find({}, { limit: 1 });
});

Meteor.publish('portfolios', function(){
	// check(this.userId, String);

	return Portfolios.find();
});

Meteor.publish('markets', function(){
	return Markets.find({}, { limit: 1 });
});
