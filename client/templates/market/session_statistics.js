Template.sessionStatistics.helpers({

	statistics: function(){
		var statistics = Statistics.findOne();

		return {
		 	estimatedValue: 					statistics.estimatedValue || 'NA',
			actualValue: 							statistics.actualValue || 'NA',
			number_of_trades: 				statistics.number_of_trades || 0,
			total_contracts_traded: 	statistics.total_contracts_traded || 0,
			open: 										statistics.open || 'NA',
			high: 										statistics.high|| 'NA',
			low: 											statistics.low || 'NA',
			last: 										statistics.last || 'NA',	
		}
	}, 

	myPortfolio: function(){
		var portfolio = Meteor.user().getPortfolioValuation();

		return {
			numberOfTrades: 				portfolio.numberOfTrades || 0,
			contractsTraded: 				portfolio.contractsTraded || 0,
			openPosition: 					commaSeparateNumber(portfolio.openPosition) || 'NA',
			avgOpenPositionPrice: 	formatForDisplay(portfolio.avgOpenPositionPrice) || 'NA',
			openPositionValue:    	formatForDisplay(portfolio.openPositionValue) || 'NA',
			cash: 									formatForDisplay(portfolio.cash),
			totalAccountValue:  		formatForDisplay(portfolio.totalAccountValue)	|| 'NA',	
			revalPrice: 						function() {
																if (portfolio.revalPrice && portfolio.revalPrice !== 0)
																	return formatForDisplay(portfolio.revalPrice);
																else 
																	return 'NA';
															},
			
		}
	}
	
});

formatForDisplay = function(data) {
	if (_.isNumber(data)) {
		return commaSeparateNumber(data.toFixed(2));
	} else {
		return '';
	}
};

commaSeparateNumber = function(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
};

sumOfFields = function(collection, field) {
	return _.reduce(
									_.map(collection.fetch(), function(doc) { return doc[field]}),
									function(memo, num) {return memo + num}
								);	
};  

avgCollectionPrice = function(collection, contractsNumber) {
	var tradesArray = _.map(collection, function(item) { return item.price * item.size; });
	return  _.reduce( tradesArray, function(m, n) { return m + n; } ) / contractsNumber;
}

 













