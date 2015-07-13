Template.myTrades.helpers({
	myTrades: function(){
		return Trades.find({userId: Meteor.userId()}, { sort: {created_at: -1}, limit: 6 });
	},
	anyTrades: function(){
		return !!Trades.findOne({ userId: Meteor.userId() });
	}
});