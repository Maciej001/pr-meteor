Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 

	topPlayers: function(){
		var market = Markets.findOne();
		return market.topPlayers();
	},

	myPortfolio: function(){
		var user = 									Meteor.user(),
				market = 								Markets.findOne(),
				portfolio = 						Portfolios.findOne({userId: Meteor.userId()}),
				statistics =						Statistics.findOne(),
				openPosition = 					Meteor.user().openPosition(),
				bestBid = 							market.bestBid(),
		 		bestOffer = 						market.bestOffer();

		var avgBuyPrice,
				avgSellPrice,
				openPositionValue = 	null,
				revalPrice = 					null,
				initialCash =					portfolio.cash,
				cash =								initialCash,
				closedProfit = 				0,
				buyTrades = 					Trades.find({userId: Meteor.userId(), side: 'buy'}),
				contractsBought =     user.contractsBought(),
				sellTrades = 					Trades.find({userId: Meteor.userId(), side: 'sell'}),
				contractsSold = 			user.contractsSold();

		// Calculate average buying price
		if (contractsBought > 0) {
			avgBuyPrice = 			avgCollectionPrice(buyTrades.fetch(), contractsBought);
		}

		// Calculate average selling price
		if (contractsSold > 0) {
			avgSellPrice = 			avgCollectionPrice(sellTrades.fetch(), contractsSold);
		}

		// Calculate average open position price
		if (openPosition > 0 ) { 	
			avgOpenPositionPrice = avgBuyPrice;
		} 
		else if (openPosition < 0) {
			avgOpenPositionPrice = avgSellPrice;
		} 
		else {
			avgOpenPositionPrice = '';
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

		return  {
							number_of_trades: 			commaSeparateNumber(portfolio.number_of_trades),
							contracts_traded: 			commaSeparateNumber(portfolio.contracts_traded),
							openPosition: 					commaSeparateNumber(openPosition),
							avgOpenPositionPrice: 	commaSeparateNumber(avgOpenPositionPrice.toFixed(2)),
							openPositionValue:    	commaSeparateNumber(openPositionValue.toFixed(2)),
							revalPrice: 						commaSeparateNumber(revalPrice.toFixed(2)), 
							cash: 									commaSeparateNumber(cash.toFixed(2)),
							totalAccountValue:  		commaSeparateNumber((cash + openPositionValue).toFixed(2))
						}
	},

	estimatedValue: function(){
		if (_.isNumber(this.estimatedValue)) {
			return this.estimatedValue
		} else {
			return ""
		}
	},
	actualValue: function(){
		if (_.isNumber(this.actualValue)) {
			return this.actualValue;
		} else {
			return "not available yet"
		}
	},
	myPortfolioDynamicValues: function(){
		return Portfolios.findOne({userId: Meteor.userId()});
	},
	
});

commaSeparateNumber = function(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

sumOfFields = function(collection, field) {
	return _.reduce(
									_.map(collection.fetch(), function(doc) { return doc[field]}),
									function(memo, num) {return memo + num}
								);	
}

// sumOfMultipliedFields = function(collection, field1, field2) {
// 	return _.reduce(
// 									_.map(collection.fetch(), function(doc) { return doc[field1] * doc[field2]}),
// 									function(memo, num) {return memo + num}
// 								);	
// }

avgCollectionPrice = function(collection, contractsNumber) {

	return  _.reduce(
						_.map(collection, function(item) { return item.price * item.size; }),
						function(m, n) { return m + n; }
					) / contractsNumber ;
}