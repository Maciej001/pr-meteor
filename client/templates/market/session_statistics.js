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
		var multiplier = 						10;
		var portfolio = 						Portfolios.findOne({userId: Meteor.userId()});
		var statistics =						Statistics.findOne();
		var contractsBought = 			0;
		var contractsSold = 				0;
		var openPosition = 					0;
		var avgBuyPrice;
		var avgSellPrice;
		var openPositionValue = 	null;
		var avgMarketPrice = 			null;
		var initialCash =					portfolio.cash;
		var closedProfit = 				0;
		var cash =								initialCash;

		var bestBid = 						Bids.findOne({}, { sort: { price: -1 } });
		var bestOffer = 					Offers.findOne({}, { sort: { price: 1 } });

		var buyTrades = 					Trades.find({userId: Meteor.userId(), side: 'buy'});
		var buyTradesCount = 			buyTrades.count();
		var sellTrades = 					Trades.find({userId: Meteor.userId(), side: 'sell'});
		var sellTradesCount = 		sellTrades.count();

		if (buyTradesCount > 0) {
			contractsBought = 	sumOfFields(buyTrades, 'size');
			avgBuyPrice = 			sumOfMultipliedFields(buyTrades,  'size', 'price') / contractsBought ;
		}

		if (sellTradesCount > 0) {
			contractsSold = 		sumOfFields(sellTrades, 'size');
			avgSellPrice = 			sumOfMultipliedFields(sellTrades, 'size', 'price') / contractsSold;
		}

		if (buyTradesCount !== sellTradesCount ) {
			openPosition  = contractsBought - contractsSold;
		}

		if (openPosition > 0 ) {
			avgOpenPositionPrice = avgBuyPrice;
		} else if (openPosition < 0) {
			avgOpenPositionPrice = avgSellPrice;
		} else {
			avgOpenPositionPrice = null;
		}

		// Find current average market price or use last trade if there were at least single trade
		// otherwise it's null
		if (!!bestBid && !!bestOffer) {
			avgMarketPrice = (bestBid.price + bestOffer.price) / 2;
		} else if (Trades.find().count() > 0) {
			avgMarketPrice = statistics.last;
		}

		if (openPosition !== 0  && !!avgMarketPrice) {
			openPositionValue  = multiplier * openPosition * (avgMarketPrice - avgOpenPositionPrice);
		}

		// Calculate current cash position if there are any closed trades
		if (buyTradesCount > 0 && sellTradesCount > 0) {
			if (contractsBought >= contractsSold) {
				closedProfit = multiplier * contractsSold * (avgSellPrice - avgBuyPrice);
			} else {
				closedProfit = multiplier * contractsBought * (avgSellPrice - avgBuyPrice);
			}

			cash = initialCash + closedProfit;
		}

		return {
			openPosition: 					openPosition,
			avgOpenPositionPrice: 	commaSeparateNumber(   (Math.round(avgOpenPositionPrice * 100 )/100).toFixed(2)),
			openPositionValue:    	commaSeparateNumber(   (Math.round(openPositionValue * 100)/100).toFixed(2)),
			revalPrice: 						commaSeparateNumber(   (Math.round(avgMarketPrice * 100)/100).toFixed(2)),
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