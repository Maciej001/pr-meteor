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

Meteor.publish('players', function(){
	return Players.find({}, { limit: 100, fields: { name: 1, totalAccountValue: 1 } });
})

// Meteor.publish('userData', function(){
// 	var self = this;
// 	var handle = Meteor.users.find({}, { fields: { emails: 1 }
// 			}).observeChanges({
// 				added: function(id, fields) {
// 					self.added('userData', id, fields);
// 				},
// 				changed: function(id, fields) {
// 					self.changed('userData', id, fields);
// 				},
// 				removed: function(id){
// 					self.removed('userData', id);
// 				}
// 	});

// 	self.ready();

// 	self.onStop(function(){
// 		handle.stop()
// 	});
// });
