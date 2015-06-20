Template.myOrderItem.helpers({
	isBuy: function(side){
		return side==='buy' ? true : false;
	}, 
	updatedAt: function(time) {
		return moment(time).format('D MMM, HH:mm:ss');
	}
});

Template.myOrderItem.events({
	'click .delete-order': function(e) {
		e.preventDefault();

		var currentOrderId = this._id;
		order = Prices.findOne(currentOrderId);

		if (order.side === 'buy') { removeBid(order) }
		else { removeOffer(order) };

		Prices.remove(currentOrderId);


	},
});

removeBid = function(order){
	var bid = Bids.findOne({price: order.price})

	// if bid is build from single price
	if (bid.prices.length === 1) {
		Bids.remove(bid._id);
		console.log('total removal');
	}
	else {
		console.log('partial removal');
		Bids.update(bid._id, { $inc: { size_left: -order.size_left }, $pull: { prices: order._id } });
	}
};

removeOffer = function(order){
	var offer = Offers.findOne({price: order.price})

	// if offer is build from single price
	if (offer.prices.length === 1) {
		Offers.remove(offer._id);
	}
	else {
		Offers.update(offer._id, { $inc: { size_left: -order.size_left }, $pull: { prices: order._id } });
	}
};