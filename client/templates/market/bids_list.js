Template.bidsList.helpers({
	bids: function(){
		return Prices.find({side: 'buy'}, {sort: {price: -1}});
	}
});