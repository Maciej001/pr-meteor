Template.sessionStatistics.onCreated(function(){

	// Create reactive variable for number of contracts user traded.
	if (!!Meteor.user()) {
		var myTrades = Trades.find({ userId: Meteor.userId() });
		if (!!myTrades) {
			var contracts_traded = _.reduce(
																_.map(myTrades, function(trade){
																	return trade.size;
																}),
																function(m, n) { return m + n; });
		} else {
			var contracts_traded = 0;
		}

		debugger;
	}

	this.contractsTraded = ReactiveVar(contracts_traded);
});

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
			openPosition: 					commaSeparateNumber(data.openPosition),
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

 













