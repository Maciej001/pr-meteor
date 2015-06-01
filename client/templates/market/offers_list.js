Template.offersList.helpers({
	offers: function(){
		return Prices.find({side: 'sell'}, {price: 1, updated_at: -1});
	}
});