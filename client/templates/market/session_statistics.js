Template.sessionStatistics.helpers({

	statistics: function(){
		var market = Markets.findOne();

		return {
		 	estimatedValue: 					market.estimatedValue || 'NA',
			actualValue: 							market.actualValue || 'NA',
			number_of_trades: 				market.number_of_trades || 0,
			total_contracts_traded: 	market.total_contracts_traded || 0,
			open: 										market.open || 'NA',
			high: 										market.high|| 'NA',
			low: 											market.low || 'NA',
			last: 										market.last || 'NA',	
		}
	}, 

	myPortfolio: function(){
		if (Meteor.user()) {
			var portfolio = Meteor.user().getPortfolioValuation();

			return {
				numberOfTrades: 				portfolio.numberOfTrades || 0,
				contractsTraded: 				portfolio.contractsTraded || 0,
				openPosition: 					commaSeparateNumber(portfolio.openPosition) || 0,
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
		} else {
			return  false;
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

 













