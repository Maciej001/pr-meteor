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
	var newOrderDecreaseInSize = 0;
	var size_traded = 0;

	// Buy order
	if (newOrder.side === 'buy'){
		// Build array of all available offers
		var existingOffers = Prices.find({side: 'sell', state: 'active'}, { sort: { price: 1 } }).fetch();
		var i = 0;
		var newOrderDecreaseInSize = 0;

		while (size_left > 0 && existingOffers[i]) {
			var offer = existingOffers[i];

			// best offer covers the newOrder.size
			if ((size_left <= offer.size_left) && (newOrder.price >= offer.price) ) {

				// contracts traded + price
				updateStatistics(size_left, offer.price);

				// Book 2 new trades (buy and sell)
				insertTrades(offer.price, size_left, newOrder.userId, offer.userId);

				// Update existing price decreasing it's size_left
				if (size_left < offer.size_left) {
					Prices.update(newOrder, { $inc: { size_left: -size_left } });
				} else {
					Prices.update(newOrder, { $set: { size_left: 0, state: 'executed'}});
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

				// Update price that is on offer as it gets partial execution
				if (offer.size_left === size_left) {
					Prices.update(offer, { $set: { state: 'executed' }, $inc: { size_left: -size_left } });
				} else {
					Prices.update(offer, { $inc: { size_left: -size_left } });
				}

				// Update new order to 'executed', size left is updated at the end of the while loop using newOrderDecreaseInSize
				Prices.update(newOrderId, { $set: { state: 'executed'}  });

				newOrderDecreaseInSize = size_left;

				size_traded += size_left;

				// Nothing left to do
				size_left = 0;
				
			} else if (newOrder.price >= offer.price) {			// When size_left for execution is greater than offer.size_left

				var decreaseSizeBy = offer.size_left;

				// contracts traded + price
				updateStatistics(offer.size_left, offer.price);

				// Book 2 new trades
				insertTrades(offer.price, offer.size_left, newOrder.userId, offer.userId);

				// Update newOrder order setting status to executed, size_left is changed after while loop is finished;
				if (offer.size_left === size_left) {
					Prices.update(newOrder, { $set: { state: 'executed' } });
				} 
				
				// Decrease size on the bid, still always will be > 0
				var bid = Bids.findOne({ prices: [newOrderId] });
				Bids.update(bid, { $inc: {size_left: -offer.size_left } });

				// Remove offer as it gets full execution
				var offerItem = Offers.findOne({ prices: [offer._id] });
				Offers.remove(offerItem._id);

				// Update price that is on offer as it gets full execution
				Prices.update(offer, { $set: { size_left: 0, state: 'executed' } });

				size_traded += decreaseSizeBy;

				size_left -= decreaseSizeBy;

			} // when size_left > offer.size_left  ENDs

			i += 1;
		} // while loop ends

		// Set new size_left on newOrder
		Prices.update(newOrderId, { $set: { size_left: size_left } });

		// Update buyer account
		updateUserAccount(Meteor.userId(), size_traded);

		// Update seller account
		updateUserAccount(offer.userId, size_traded);


	} else { // if newOrder.side === 'sell'

		// Build array of all available offers
		var existingBids = Prices.find({side: 'buy', state: 'active'}, { sort: { price: -1 } }).fetch();
		var i = 0;

		while (size_left > 0 && existingBids[i]) {
			var bid = existingBids[i];

			// best bid covers the newOrder.size
			if ((size_left <= bid.size_left) && (newOrder.price <= bid.price) ) {

				// contracts traded + price
				updateStatistics(size_left, bid.price);

				// Book 2 new trades (buy and sell), full size gets executed
				insertTrades(bid.price, size_left, bid.userId, newOrder.userId);

				// Update existing price decreasing it's size_left
				if (size_left < bid.size_left) {
					Prices.update(newOrder, { $inc: { size_left: -size_left } });
				} else {
					Prices.update(newOrder, { $set: { size_left: 0, state: 'executed'}});
				}

				// Remove from Offerss, as offer order gets fully executed
				var offer = Offers.findOne({ prices: [newOrderId] });
				Offers.remove(offer);

				// Update Bids collection
				var bidItem = Bids.findOne({ prices: [bid._id] });
				if (size_left < bid.size_left) {
					Bids.update(bidItem, { $inc: { size_left: -size_left } });
				} else {
					Bids.remove(bidItem);
				}

				// Update new order to 'executed' and size_left: 0
				Prices.update(newOrderId, { $set: { state: 'executed', size_left: 0 }  });

				// Update price that is on bid as it gets partial execution
				if (bid.size_left === size_left) {
					Prices.update(bid, { $set: { state: 'executed' }, $inc: { size_left: -size_left } });
				} else {
					Prices.update(bid, { $inc: { size_left: -size_left } });
				}

				size_traded += size_left;

				// Nothing left to do
				size_left = 0;

			} else if (newOrder.price <= bid.price) {  // When size_left is originally greater than bid.size_left
				
				var decreaseSizeBy = bid.size_left;

				// contracts traded + price
				updateStatistics(bid.size_left, bid.price);

				// Book 2 new trades
				insertTrades(bid.price, bid.size_left, bid.userId, newOrder.userId);

				// Update newOrder order setting status to executed, size_left is changed after while loop is finished;
				if (bid.size_left === size_left) {
					Prices.update(newOrder, { $set: { state: 'executed' } });
				} 

				// Decrease size on the offer (newOrder), still always will be > 0
				var offer = Offers.findOne({ prices: [newOrderId] });
				Offers.update(offer, { $inc: {size_left: -bid.size_left } });

				// Update existing price - full execution on the price
				Prices.update(bid, { $set: { size_left: 0, state: 'executed' } });

				// Remove bid as it gets full execution
				var bidItem = Bids.findOne({ prices: [bid._id] });
				Bids.remove(bidItem);

				// Update price that is on bid as it gets full execution
				Prices.update(bid, { $set: { size_left: 0, state: 'executed' } });

				size_traded += decreaseSizeBy;

				size_left -= decreaseSizeBy;
			} // when size_left > bid.size_left  ENDs

			i += 1;
		} // while loop ends

		// Set new size_left on newOrder
		Prices.update(newOrderId, { $set: { size_left: size_left } });

		// Update buyer account
		updateUserAccount(Meteor.userId(), size_traded);

		// Update seller account
		updateUserAccount(bid.userId, size_traded);


	} 
}

updateStatistics = function(contracts_traded, price) {
	var statistics = Statistics.findOne();

	var total_contracts_traded = 		statistics.total_contracts_traded + contracts_traded;
	var number_of_trades =					statistics.number_of_trades + 1;
	var open =											statistics.open || price;
	var high =	 										Math.max(statistics.high, price) || price;
	var low =												Math.min(statistics.low, price) || price;
	var last = 											price;

	Statistics.update(statistics, { $set: {
		total_contracts_traded:			total_contracts_traded,
		number_of_trades: 					number_of_trades,
		open: 											open,
		high: 											high,
		low: 												low,
		last: 											last
	}});
}

updateUserAccount = function(userId, contracts_traded) {
	var user = Meteor.users.findOne({ _id: userId });

	var	data = user.portfolioValuation();

	var	portfolio = Portfolios.findOne({ userId: userId });

	var result = Portfolios.update(portfolio._id, 
		{ 
			$set: {
							number_of_trades: 			portfolio.number_of_trades + 1,
							contracts_traded: 			portfolio.contracts_traded + contracts_traded,
							openPosition: 					data.openPosition,
							avgOpenPositionPrice: 	data.avgOpenPositionPrice,
							openPositionValue:    	data.openPositionValue,
							revalPrice: 						data.revalPrice, 
							cash: 									data.cash,
							totalAccountValue:  		data.totalAccountValue			
						}
		}
	);


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

orderTradeable = function(newOrder) {
	var market = Markets.findOne();

	if (newOrder.side === 'buy') {
		var bestOffer = market.bestOffer();

		// if there are no offers best_offer will is undefined
		if (bestOffer) {
			if (newOrder.price >= bestOffer.price) 
				return true;
		} else {
			return false;
		}

	} else {

		var bestBid = market.bestBid();
		if (bestBid) {
			if (newOrder.price <= bestBid.price) 
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

	var risk;

	return errors
}









			





