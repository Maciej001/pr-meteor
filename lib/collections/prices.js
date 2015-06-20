Prices = 	new Mongo.Collection('prices');
Bids = 		new Mongo.Collection('bids');
Offers = 	new Mongo.Collection('offers');
Trades = 	new Mongo.Collection('trades');

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

		var newOrder = _.extend(orderAttributes, {
			state: 				"active",
			size_left: 		orderAttributes.size,
			userId: 			user._id,
			created_at: 	new Date(),
			updated_at: 	new Date()
		});

		// Check for errors on Server side
		var errors = validateOrder(newOrder);
		if (errors.price || errors.size || errors.myself)
			return Session.set('orderSubmitErrors', errors);

		// Execute trade if tradeable
		if (orderTradeable(newOrder)) {
			executeTrade(newOrder);
		}

		// If newOrder not executed in full insert order with what's left size
		if (newOrder.size_left > 0) {
			var orderId = Prices.insert(newOrder);

			// add to Bids or Offers Collection
			if (newOrder.side === 'buy') { 
				insertNewBid(newOrder, orderId); 
			} 
			else {
				insertNewOffer(newOrder, orderId); 
			}

			return {
				_id: orderId
			};
		} else {
			return null;
		}
	}
});

executeTrade = function(newOrder) {
	var size_left = newOrder.size_left;

	// Buy order
	if (newOrder.side === 'buy'){
		var existingOffers = Prices.find({side: 'sell', state: 'active'}, { sort: { price: 1 } }).fetch();
		var i = 0;

		while (size_left > 0) {
			var offer = existingOffers[i];
			// first offer covers the newOrder.size
			if (size_left < offer.size_left) {

				console.log('executing trade!');
				size_left = 0;
				newOrder.size_left = 0;
				newOrder.state = 'executed';

				var buyTrade = {
					side: 			'buy',
					price: 			newOrder.price,
					size:  			newOrder.size, 
					userId: 		newOrder.userId, 
					created_at: new Date()
				};

				var sellTrade = {
					side: 			'sell',
					price: 			newOrder.price,
					size:  			newOrder.size, 
					userId: 		offer.userId, 
					created_at: new Date()
				}

				Trades.insert(sellTrade);
				Trades.insert(buyTrade);

				Prices.update(offer._id, { $inc: { size_left: -newOrder.size } });
			} 
		}

	}
}

insertNewBid = function(newOrder, newOrderId){
	console.log('newOrder id ', newOrder._id);
	var bidExists = Bids.findOne({ price: newOrder.price });

	// increase size of existing bid and add refrence to original price id
	if (!!bidExists) {
		Bids.update(bidExists._id, {$inc: {size_left: newOrder.size_left}, $push: { prices: newOrderId } });
	} 
	else {
		_.extend(newOrder, {
			prices: [newOrderId]
		});
		Bids.insert(newOrder); // or if size does not exist, add new order to bids Collection
	}
};

insertNewOffer = function(newOrder, newOrderId){
	var offerExists = Offers.findOne({price: newOrder.price});

	// if offer exists increase the size in offers Collection
	if (!!offerExists) {
		Offers.update(offerExists._id, {$inc: {size_left: newOrder.size_left}, $push: { prices: newOrderId } });
	}
	else {
		_.extend(newOrder, {
			prices: [newOrderId]
		})
		Offers.insert(newOrder);
	}
}

bestBid 	= function(){	return    Bids.findOne({}, { sort: { price: -1 } }); }
bestOffer = function(){	return    Offers.findOne({}, { sort: { price: 1 } }); }

orderTradeable = function(newOrder) {
	if (newOrder.side === 'buy') {
		var best_offer = bestOffer();
		if (newOrder.price >= best_offer.price) { return true; }

	} else {

		var best_bid = bestBid();
		if (newOrder.price <= best_bid.price) { return true; } 
	}

	return false;
}

tradingWithMyself = function(newOrder) {
	// if we want to sell 3 at 90, and there is 100 bid in 5 that is not mine
	// and 90 bid that is mine it will still return false!!! that should be corrected

	if ( orderTradeable(newOrder) ) {

		// find my OWN lowest offer or highest bid
		if (newOrder.side === 'buy') {
			var myExistingOrder = Prices.findOne({ side: "sell", state: 'active', userId: newOrder.userId }, { sort: {price: 1 } });
			if (newOrder.price >= myExistingOrder.price) { return true; } 
		} else {
			var myExistingOrder = Prices.findOne({ side: "buy", state: 'active', userId: newOrder.userId }, { sort: { price: -1 } });
			if (newOrder.price <= myExistingOrder.price) { return true; }
		}
	} 

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