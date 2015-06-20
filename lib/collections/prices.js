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

		// Check for errors in input data on Server side
		var errors = validateOrder(newOrder);
		if (errors.price || errors.size || errors.myself)
			return Session.set('orderSubmitErrors', errors);

		// Insert new order to Prices
		var orderId = Prices.insert(newOrder);

		// Insert new order to Bids or Offers
		if (newOrder.side === 'buy') { 
			insertNewBid(newOrder, orderId); 
		} 
		else {
			insertNewOffer(newOrder, orderId); 
		}

		// Execute trade if tradeable
		if (orderTradeable(newOrder)) {
			executeTrade(newOrder);
		}

		return {
			_id: orderId
		};

	}
});

executeTrade = function(newOrder) {
	var size_left = newOrder.size_left;

	// Buy order
	if (newOrder.side === 'buy'){
		var existingOffers = Prices.find({side: 'sell', state: 'active'}, { sort: { price: 1 } }).fetch();
		var i = 0;

		while (size_left > 0 && existingOffers[i]) {
			var offer = existingOffers[i];

			// best offer covers the newOrder.size
			if (size_left < offer.size_left) {
				// Book new 2 new trade (buy and sell)
				insertTrades(newOrder.price, newOrder.size, newOrder.userId, offer.userId);

				// Update existing offer decreasing it's size_left
				Prices.update(offer._id, { $inc: { size_left: -newOrder.size } });

				// Update new order to executed and size_left: 0
				newOrder.state = 'executed';
				newOrder.size_left = 0;

				// Nothing left to do
				size_left = 0;

				return newOrder
			} 
		} 

	}
}

insertTrades = function(price, size, buyerId, sellerId) {
	var buyTrade = {
		side: 			'buy',
		price: 			price,
		size:  			size, 
		userId: 		buyerId, 
		created_at: new Date()
	};

	var sellTrade = {
		side: 			'sell',
		price: 			price,
		size:  			size, 
		userId: 		sellerId, 
		created_at: new Date()
	}

	Trades.insert(buyTrade);
	Trades.insert(sellTrade);
}

insertNewBid = function(newOrder, newOrderId){
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