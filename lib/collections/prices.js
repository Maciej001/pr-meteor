Prices = new Mongo.Collection('prices');

Prices.allow({
	update: function(userId, order) { return ownsOrder(userId, order); },
	remove: function(userId, order) { return ownsOrder(userId, order); },
});

Meteor.methods({
	insertNewOrder: function(orderAttributes) {

		// check if user is logged in
		check( Meteor.userId(), String );

		// check if proper arguments were passed
		check(orderAttributes, {
			price: 				Number,
			size: 				Number,
			side: 				'buy' || 'sell'
		});

		var user = Meteor.user();

		var order = _.extend(orderAttributes, {
			state: 				"active",
			userId: 			user._id,
			created_at: 	new Date(),
			updated_at: 	new Date()
		});

		var orderId = Prices.insert(order);

		return {
			_id: orderId
		};

	}
});