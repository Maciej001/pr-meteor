Template.bidsList.helpers({
	bids: function(){
		return Prices.find({side: 'buy'}, {price: -1, updated_at: -1});
	}
});