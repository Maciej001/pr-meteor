Template.bidsList.helpers({
	bids: function(){
		return Prices.find({side: 'buy'}, {price: -1, updated_at: -1});
	}
});

Template.offersList.helpers({
	offers: function(){
		return Prices.find({side: 'sell'}, {price: 1, updated_at: -1});
	}
});