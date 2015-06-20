Prices = 	new Mongo.Collection('prices');
Bids = 		new Mongo.Collection('bids');
Offers = 	new Mongo.Collection('offers');

Prices.allow({
	update: function(userId, order) { return ownsOrder(userId, order); },
	remove: function(userId, order) { return ownsOrder(userId, order); },
});

Bids.allow({
	update: function() { return true; },
	remove: function() { return true; },
});

Offers.allow({
	update: function() { return true; },
	remove: function() { return true; },
});

Meteor.methods({
	insertNewOrder: function(orderAttributes) {

		// check if user is logged in
		check( Meteor.userId(), String );

		var user = Meteor.user();

		var order = _.extend(orderAttributes, {
			state: 				"active",
			size_left: 		orderAttributes.size,
			userId: 			user._id,
			created_at: 	new Date(),
			updated_at: 	new Date()
		});

		// check for errors on Server side
		var errors = validateOrder(order);
		if (errors.price || errors.size || errors.myself)
			return Session.set('orderSubmitErrors', errors);

		var orderId = Prices.insert(order);

		// add to Bids or Offers Collection
		if (order.side === 'buy') { 
			insertNewBid(order); 
		} 
		else {
			insertNewOffer(order); 
		}

		return {
			_id: orderId
		};
	}
});

insertNewBid = function(order){
	var bidExists = Bids.findOne({ price: order.price });

	// increase size of existing bid
	if (!!bidExists) {
		Bids.update(bidExists._id, {$inc: {size_left: order.size_left}});
	} 
	else {
		Bids.insert(order); // or if size does not exist, add new order to bids Collection
	}
};

insertNewOffer = function(order){
	var offerExists = Offers.findOne({price: order.price});

	// if offer exists increase the size in offers Collection
	if (!!offerExists) {
		Offers.update(offerExists._id, {$inc: {size_left: order.size_left}});
	}
	else {
		Offers.insert(order);
	}
}

bestBid 	= function(){	return    Bids.findOne({}); }
bestOffer = function(){	return    Offers.findOne({}); }

orderTradeable = function(order) {
	if (order.side === 'buy') {
		var best_offer = bestOffer();
		if (order.price >= best_offer.price) { return true; }

	} else {

		var best_bid = bestBid();
		if (order.price <= best_bid.price) { return true; } 
	}

	return false;
}

tradingWithMyself = function(newOrder) {
	if ( orderTradeable(newOrder) ) {

		// find my own lowest offer or highest bid
		if (newOrder.side === 'buy') {
			var myExistingOrder = Prices.findOne({ side: "sell", state: 'active', userId: newOrder.userId }, { sort: {price: 1 } });
			if (newOrder.price >= myExistingOrder.price) { return true; } 
		} else {
			var myExistingOrder = Prices.findOne({ side: "sell", state: 'active', userId: newOrder.userId }, { sort: { price: -1 } });
			if (newOrder.price <= myExistingOrder.price) { return true; }
		}
	} // orderTradable

	return false; 
}

validateOrder = function(order) {
	var errors = {};
	var user = Meteor.user();

	var check_order = _.extend(order, {
			state: 				"active",
			userId: 			user._id,
		});

	// trading with myself 
	if (tradingWithMyself(check_order)) {
		errors.myself = "Wow! You are trying to trade with yourself. Please change your price!"
	}

	if (!order.price) {
		errors.price = "Please input price";
	} 

	if (!order.size) {
		errors.size = "Please input size";
	}

	if ( ! _.isNumber(order.price) ) {
		errors.price = "Price should be number";
	}

	if ( ! _.isNumber(order.size) ) {
		errors.size = "Size should be number";
	}

	return errors
}