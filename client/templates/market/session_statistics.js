Template.sessionStatistics.helpers({

	statistics: function(){
		return Statistics.findOne();
	}, 

	topPlayers: function(){
		return Players.find({}, { limit: 5, sort: { totalAccountValue: 1 } });
	},

	myPortfolio: function(){
		var portfolio = Meteor.user().getPortfolioValuation();
		
		debugger;

		return {
			numberOfTrades: 				portfolio.numberOfTrades,
			contractsTraded: 				portfolio.contractsTraded,
			openPosition: 					commaSeparateNumber(portfolio.openPosition),
			avgOpenPositionPrice: 	formatForDisplay(portfolio.avgOpenPositionPrice),
			openPositionValue:    	formatForDisplay(portfolio.openPositionValue),
			revalPrice: 						formatForDisplay(portfolio.revalPrice), 
			cash: 									formatForDisplay(portfolio.cash),
			totalAccountValue:  		formatForDisplay(portfolio.totalAccountValue)		
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

 













