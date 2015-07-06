Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 

	topPlayers: function(){
		return Players.find({}, { limit: 5, sort: { totalAccountValue: 1 } });
	},

	myPortfolio: function(){

		var data =  Meteor.user().portfolioValuation();

		return {
			number_of_trades: 			data.number_of_trades,
			contracts_traded: 			data.contracts_traded,
			openPosition: 					formatForDisplay(data.openPosition),
			avgOpenPositionPrice: 	formatForDisplay(data.avgOpenPositionPrice),
			openPositionValue:    	formatForDisplay(data.openPositionValue),
			revalPrice: 						formatForDisplay(data.revalPrice), 
			cash: 									formatForDisplay(data.cash),
			totalAccountValue:  		formatForDisplay(data.totalAccountValue)		
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