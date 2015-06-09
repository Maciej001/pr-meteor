Template.offersList.helpers({
	offers: function(){
		return Prices.find({side: 'sell'}, {sort: {price: 1}});
	}
});