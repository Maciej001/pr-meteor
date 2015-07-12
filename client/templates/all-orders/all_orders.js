Template.allOrders.helpers({
	myAllOrders: function(){
		return Prices.find({userId: Meteor.userId()}, { sort: { created_at: -1 } });
	},
});