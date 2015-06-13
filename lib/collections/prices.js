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

		// check for errors on Server side
		var errors = validateOrder(order);
		if (errors.price || errors.size)
			return Session.set('orderSubmitErrors', errors);

		var orderId = Prices.insert(order);

		return {
			_id: orderId
		};
	}
});

validateOrder = function(order) {
	var errors = {};

	if (!order.price) {
		errors.price = "Please input price";
	} 

	if (!order.size) {
		errors.size = "Please input size";
	}

	if ( isNaN(order.price) ) {
		errors.price = "Price should be number";
	}

	if ( isNaN(order.size) ) {
		errors.size = "Size should be number";
	}

	return errors
}