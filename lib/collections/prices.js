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
			var newBid = _.omit(newOrder, 'userId');
			insertNewBid(newBid, orderId); 
		} 
		else {
			var newOffer = _.omit(newOrder, 'userId');
			insertNewOffer(newOffer, orderId); 
		}

		// Execute trade if tradeable
		if (orderTradeable(newOrder)) {
			executeTrade(newOrder, orderId);
		}

		return {
			_id: orderId
		};

	}
});

executeTrade = function(newOrder, newOrderId) {
	var size_left = newOrder.size_left;

	// Buy order
	if (newOrder.side === 'buy'){
		// Build array of all available offers
		var existingOffers = Prices.find({side: 'sell', state: 'active'}, { sort: { price: 1 } }).fetch();
		var i = 0;

		while (size_left > 0 && existingOffers[i]) {
			var offer = existingOffers[i];

			// best offer covers the newOrder.size
			if ((size_left <= offer.size_left) && (newOrder.price >= offer.price) ) {
				console.log('size left 2nd turn is ', size_left);
				console.log('new order price ', newOrder.price);
				console.log('offer price ', offer.price);

				// Book 2 new trades (buy and sell)
				insertTrades(offer.price, size_left, newOrder.userId, offer.userId);

				// Update existing offer decreasing it's size_left
				Prices.update(offer, { $inc: { size_left: -size_left } });
				if (offer.size_left === 0) {
					Prices.update(offer._id, { $set: { state: 'executed' } });
				}

				// Remove from Bids, as bid gets fully executed
				var bid = Bids.findOne({ prices: [newOrderId] });
				Bids.remove(bid);

				// Update Offer collection
				var offerItem = Offers.findOne({ prices: [offer._id] });
				if (size_left < offer.size_left) {
					Offers.update(offerItem, { $inc: { size_left: -size_left } });
				} else {
					Offers.remove(offerItem);
				}


				// Update new order to 'executed' and size_left: 0
				Prices.update(newOrderId, { $set: { state: 'executed', size_left: 0 }  });

				// Nothing left to do
				size_left = 0;
			} else if (newOrder.price >= offer.price) {
				var decreaseSizeBy = offer.size_left
				// When size_left is originally greater than offer.size_left
				// Book 2 new trades
				insertTrades(offer.price, offer.size_left, newOrder.userId, offer.userId);

				// Update existing price - full execution on the price
				Prices.update(offer, { $set: { size_left: 0, state: 'executed' } });

				// Decrease size on the bid, still always will be > 0
				var bid = Bids.findOne({ prices: [newOrderId] });
				Bids.update(bid, { $inc: {size_left: -offer.size_left } });

				// Remove offer as it gets full execution
				var offerItem = Offers.findOne({ prices: [offer._id] });
				Offers.remove(offerItem);

				size_left -= decreaseSizeBy;
			} // when size_left > offer.size_left  ENDs

			i += 1;
		} // while loop ends

	} // if 'buy' ends
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

		// if there are no offers best_offer will is undefined
		if (best_offer) {
			if (newOrder.price >= best_offer.price) 
				return true;
		} else {
			return false;
		}

	} else {

		var best_bid = bestBid();
		if (best_bid) {
			if (newOrder.price <= best_bid.price) 
				return true; 
		} else {
			return false;
		}
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
			// if there are any my existing orders
			if (myExistingOrder) {
				if (newOrder.price >= myExistingOrder.price) { return true; } 
			} else { 
				return false; 
			}
		} else {
			var myExistingOrder = Prices.findOne({ side: "buy", state: 'active', userId: newOrder.userId }, { sort: { price: -1 } });
			if (myExistingOrder){
				// if there are any existing orders
				if (newOrder.price <= myExistingOrder.price) { return true; }
			} else {
				return false;
			}
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













