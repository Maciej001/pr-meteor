Template.priceItem.helpers({
	myPrice: function(){
		var currentUserId = Meteor.userId();
		var pricesIds = this.prices;
		var isMyPrice = false;

		// Check all Prices connected to given Bid or Offer.
		// Find the price and check if it's userId is same as current user Id
		_.each(pricesIds, function(priceId){
			var price = Prices.findOne(priceId);
			if (price.userId === currentUserId) { 
				isMyPrice = true; 
			}
		});

		return isMyPrice;
	}
});