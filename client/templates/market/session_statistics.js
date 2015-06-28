Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 
	myPortfolio: function(){
		return Portfolios.findOne({ userId: Meteor.userId() });
	},
	myPortfolioDynamicValues: function(){
		var portfolio = 				Portfolios.find({userId: Meteor.userId()});
		var contractsBought = 	0;
		var contractsSold = 		0;
		var openPosition = 			0;
		var avgBuyPrice;
		var avgSellPrice;

		var buyTrades = 	Trades.find({userId: Meteor.userId(), side: 'buy'});
		var sellTrades = 	Trades.find({userId: Meteor.userId(), side: 'sell'});

		if (buyTrades.count()>0) {
			contractsBought = 	sumOfFields(buyTrades, 'size');
			avgBuyPrice = 			Math.round(sumOfMultipliedFields(buyTrades,  'size', 'price') / contractsBought * 10) / 10 ;
		}

		if (sellTrades.count()>0) {
			contractsSold = 		sumOfFields(sellTrades, 'size');
			avgSellPrice = 			Math.round(sumOfMultipliedFields(sellTrades, 'size', 'price') / contractsSold   * 10) / 10;
		}

		
		if (buyTrades.count()>0 || sellTrades.count()>0) {
			openPosition  = contractsBought - contractsSold;
		}


		if (openPosition > 0 ) {
			avgOpenPositionPrice = avgBuyPrice;
		} else if (openPosition < 0) {
			avgOpenPositionPrice = avgSellPrice;
		} else {
			avgOpenPositionPrice = null;
		}

		return {
			openPosition: openPosition,
			avgOpenPositionPrice: avgOpenPositionPrice,
			openPositionValue:    25,
			cash: 								30,
			totalAccountValue:  		40
		}
	}
});

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