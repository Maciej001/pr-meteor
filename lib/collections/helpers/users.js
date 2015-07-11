// User helpers - thanks to collection-helpers package by dburles

Users = Meteor.users;

Users.helpers({
	isAdmin: function(){
		role =  Roles.userIsInRole(this._id, ['admin']);
		return role;
	},

	contractsBought: function() {
		var buySizesArray,
				buyTrades = Trades.find({ userId: this._id, side: 'buy' }).fetch();

		if (buyTrades.length > 0) {
			buySizesArray = _.map(buyTrades, function(trade){
				return trade.size;
			});

			return _.reduce(buySizesArray, function(memo, size){ 
								return memo + size;
							});
		} 
		else {
			return 0;
		}
	},

	contractsSold: function() {
		var sellSizesArray,
				sellTrades = 	Trades.find({ userId: this._id, side: 'sell' }).fetch();

		if (sellTrades.length > 0) {
			sellSizesArray = _.map(sellTrades, function(trade){
				return trade.size;
			});

			return _.reduce(sellSizesArray, function(sum, size){ 
								return sum + size;
							});
		} 
		else {
			return 0;
		}
	},

	openPosition: function(){
		return this.contractsBought() - this.contractsSold();
	},

	portfolioValuation: function() {
		var user =									this,
				market = 								Markets.findOne(),
				portfolio = 						Portfolios.findOne({userId: user._id}),
				statistics =						Statistics.findOne(),
				openPosition = 					user.openPosition(),
				bestBid = 							market.bestBid(),
		 		bestOffer = 						market.bestOffer();

		var avgBuyPrice,
				avgSellPrice,
				avgOpenPositionPrice =   	'',
				openPositionValue = 	'',
				revalPrice = 					'',
				totalAccountValue =   '',
				initialCash =					portfolio.cash,
				cash =								initialCash,
				closedProfit = 				0,
				buyTrades = 					Trades.find({userId: user._id, side: 'buy'}),
				contractsBought =     user.contractsBought(),
				sellTrades = 					Trades.find({userId: user._id, side: 'sell'}),
				contractsSold = 			user.contractsSold();

		// Calculate average buying price
		if (contractsBought > 0) {
			debugger;
			avgBuyPrice = 			avgCollectionPrice(buyTrades.fetch(), contractsBought);
		}

		// Calculate average selling price
		if (contractsSold > 0) {
			debugger;
			avgSellPrice = 			avgCollectionPrice(sellTrades.fetch(), contractsSold);
		}

		// Calculate average open position price
		if (openPosition > 0 ) { 	
			avgOpenPositionPrice = avgBuyPrice;
		} 
		else if (openPosition < 0) {
			avgOpenPositionPrice = avgSellPrice;
		} 

		// Calculate reval price. Mid off the market if exists or last trade.
		if (!!bestBid && !!bestOffer) {
			revalPrice = (bestBid.price + bestOffer.price) / 2;
		} else if (Trades.find().count() > 0) {
			revalPrice = statistics.last;
		} else { revalPrice = 0;}

		// Calculate Open position valuation
		if (openPosition !== 0  && !!revalPrice) {
			openPositionValue  = market.multiplier * openPosition * (revalPrice - avgOpenPositionPrice);
		} 

		// Calculate current cash position if there are any closed trades
		if (contractsBought > 0 && contractsSold > 0) {
			if (contractsBought >= contractsSold) {
				closedProfit = market.multiplier * contractsSold * (avgSellPrice - avgBuyPrice);
			} else {
				closedProfit = market.multiplier * contractsBought * (avgSellPrice - avgBuyPrice);
			}
			cash = initialCash + closedProfit;
		}

		if (_.isNumber(openPositionValue)) {
			totalAccountValue = commaSeparateNumber((cash + openPositionValue).toFixed(2));
		}

		return  {
							number_of_trades: 			portfolio.number_of_trades,
							contracts_traded: 			portfolio.contracts_traded,
							openPosition: 					openPosition,
							avgOpenPositionPrice: 	avgOpenPositionPrice,
							openPositionValue:    	openPositionValue,
							revalPrice: 						revalPrice, 
							cash: 									cash,
							totalAccountValue:  		totalAccountValue						
						}
	}
});