Template.myOrders.helpers({
	myOrders: function(){
		return Prices.find({userId: Meteor.userId()}, {sort: {created_at: -1}});
	},
});