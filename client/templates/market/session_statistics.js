Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 

	topPlayers: function(){
		var market = Markets.findOne();
		return market.topPlayers();
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

sumOfMultipliedFields = function(collection, field1, field2) {
	return _.reduce(
									_.map(collection.fetch(), function(doc) { return doc[field1] * doc[field2]}),
									function(memo, num) {return memo + num}
								);	
}