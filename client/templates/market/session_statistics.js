Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 
	myAccount: function(){
		return Portfolios.findOne({ userId: Meteor.userId });
	}
});