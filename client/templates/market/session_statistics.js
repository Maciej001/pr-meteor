Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 
	myPortfolio: function(){
		return Portfolios.findOne({ userId: Meteor.userId() });
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
			avgBuyPrice = 			sumOfMultipliedFields(buyTrades,  'size', 'price') / contractsBought ;
		}

		// Calculate average selling price
		if (contractsSold > 0) {
			avgSellPrice = 			sumOfMultipliedFields(sellTrades, 'size', 'price') / contractsSold;
		}

		// Calculate average open position price
		if (openPosition > 0 ) { 	
			avgOpenPositionPrice = avgBuyPrice;
		} 
		else if (openPosition < 0) {
			avgOpenPositionPrice = avgSellPrice;
		} 
		else {
			avgOpenPositionPrice = null;
		}

		// Calculate reval price. Mid off the market if exists or last trade.
		if (!!bestBid && !!bestOffer) {
			revalPrice = (bestBid.price + bestOffer.price) / 2;
		} else if (Trades.find().count() > 0) {
			revalPrice = statistics.last;
		}

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

		return {
			openPosition: 					openPosition,
			avgOpenPositionPrice: 	commaSeparateNumber(   (Math.round(avgOpenPositionPrice * 100 )/100).toFixed(2)),
			openPositionValue:    	commaSeparateNumber(   (Math.round(openPositionValue * 100)/100).toFixed(2)),
			revalPrice: 						commaSeparateNumber(   (Math.round(revalPrice * 100)/100).toFixed(2)),
			cash: 									commaSeparateNumber(   (Math.round(cash * 100)/100).toFixed(2)),
			totalAccountValue:  		commaSeparateNumber(   (Math.round((cash + openPositionValue) * 100)/100).toFixed(2))
		}
	}
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

sumOfMultipliedFields = function(collection, field1, field2) {
	return _.reduce(
									_.map(collection.fetch(), function(doc) { return doc[field1] * doc[field2]}),
									function(memo, num) {return memo + num}
								);	
}