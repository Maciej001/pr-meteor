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
	if (order.size == bid.size) {
		Bids.remove(bid._id);
	}
	else {
		Bids.update(bid._id, {$inc: {size: -order.size}});
	}
};

removeOffer = function(order){
	var offer = Offers.findOne({price: order.price})
	if (order.size == offer.size) {
		Offers.remove(offer._id);
	}
	else {
		Offers.update(offer._id, {$inc: {size: -order.size}});
	}
};