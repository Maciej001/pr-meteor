Template.myTrades.helpers({
	myTrades: function(){
		return Trades.find({userId: Meteor.userId()}, {sort: {created_at: -1}});
	},
});