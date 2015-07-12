Template.allTrades.helpers({
	myAllTrades: function(){
		return Trades.find({userId: Meteor.userId()}, { sort: { created_at: -1 } });
	},
});