Template.myOrderItem.helpers({
	isBuy: function(side){
		return side==='buy' ? true : false;
	}, 
	updatedAt: function(time) {
		return moment(this.created_at).format('D MMM, HH:mm:ss');
	}
});

Template.myOrderItem.events({
	'click .delete-order': function(e) {
		e.preventDefault();

		var currentOrderId = this._id;
		order = Prices.findOne(currentOrderId);

		// Check if user logged in and it's his order
		if (Meteor.user() && (Meteor.userId() === order.userId)) {

			if (order.side === 'buy') { order.removeBid() }
			else { order.removeOffer() };

			Prices.remove(currentOrderId);
		}
	}
});