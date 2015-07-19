Template.pricesList.helpers({
	bids: function(){
		return Bids.find({}, {sort: {price: -1}, limit: 5});
	},
	offers: function(){
		return Offers.find({}, {sort: {price: 1}, limit: 5});
	},
	anyPrices: function(){
		return (Bids.findOne() || Offers.findOne());
	}
});