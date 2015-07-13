Template.myOrders.helpers({
	myOrders: function(){
		return Prices.find({userId: Meteor.userId()}, { sort: {created_at: -1}, limit: 6 });
	},
	anyActiveOrders: function(){
		return !!Prices.findOne({ userId: Meteor.userId(), state: 'active' });
	}, 
	anyOrders: function(){
		return !!Prices.findOne({ userId: Meteor.userId() });
	}
});