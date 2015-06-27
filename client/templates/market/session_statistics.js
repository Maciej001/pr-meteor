Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 
	myPortfolio: function(){
		return Portfolios.findOne({ userId: Meteor.userId() });
	},

	openPositionValue: function() {
		return 0;
	},
	avgPositionPrice: function() {
		return 0;
	},
	totalAccountValue: function() {
		return 0;
	}
});