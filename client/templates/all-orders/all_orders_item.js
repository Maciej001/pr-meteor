Template.allOrdersItem.helpers({
	isBuy: function(side){
		return side==='buy' ? true : false;
	}, 
	updatedAt: function(time) {
		return moment(this.created_at).format('D MMM, HH:mm:ss');
	}, 
	currentState: function() {
		if (this.state === 'active') {
			return 'order-active'
		}
	}, 
	isOrderActive: function() {
		if (this.state === 'active') {
			return true;
		}

		return false;
	}
});

Template.allOrdersItem.events({
	'click .delete-order': function(e) {
		e.preventDefault();

		order = Prices.findOne(this._id);

		// Check if user logged in and it's his order
		if (Meteor.user() && (Meteor.userId() === order.userId)){

			if (order.side === 'buy') { order.removeBid() }
			else { order.removeOffer() };

			Prices.remove(this._id);
		}
	}
})