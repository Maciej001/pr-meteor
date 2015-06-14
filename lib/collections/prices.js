Prices = 	new Mongo.Collection('prices');
Bids = 		new Mongo.Collection('bids');
Offers = 	new Mongo.Collection('offers');

Prices.allow({
	update: function(userId, order) { return ownsOrder(userId, order); },
	remove: function(userId, order) { return ownsOrder(userId, order); },
});

Meteor.methods({
	insertNewOrder: function(orderAttributes) {

		// check if user is logged in
		check( Meteor.userId(), String );

		// check below throws an error when side is 'sell'
		// check if proper arguments were passed
		// check(orderAttributes, {
		// 	price: 				Number,
		// 	size: 				Number,
		// 	side: 				("buy" || "sell")
		// });

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

		// add to Bids or Offers Collection
		if (order.side === 'buy') { 
			insertNewBid(order) 
		} 
		else {
			insertNewOffer(order) 
		}

		return {
			_id: orderId
		};
	}
});

insertNewBid = function(order){
	var bidExists = Bids.findOne( {price: order.price} );

	// increase size of existing bid
	if (!!bidExists) {
		Bids.update(bidExists._id, {$inc: {size: order.size}});
	} 
	else {
		Bids.insert(order); // or if size does not exist, add new order to bids Collection
	}
};

insertNewOffer = function(order){
	var offerExists = Offers.findOne({price: order.price});

	// if offer exists increase the size in offers Collection
	if (!!offerExists) {
		Offers.update(offerExists._id, {$inc: {size: order.size}});
	}
	else {
		Offers.insert(order);
	}
}

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