Template.priceItem.helpers({
	isMyBid: function(){
		var currentUserId = Meteor.userId();
		var pricesIds = this.prices;

		if (this.side === 'buy') {
			// Check all Prices connected to given Bid or Offer.
			// Find the price and check if it's userId is same as current user Id
			_.each(pricesIds, function(priceId){
				var price = Prices.findOne(priceId);
				if (price.userId === currentUserId) { 
					return true; 
				}
			});
		}

		return false;
	},

	isMyOffer: function(){
		var currentUserId = Meteor.userId();
		var pricesIds = this.prices;

		if (this.side === 'sell') {
			// Check all Prices connected to given Bid or Offer.
			// Find the price and check if it's userId is same as current user Id
			_.each(pricesIds, function(priceId){
				var price = Prices.findOne(priceId);
				if (price.userId === currentUserId) { 
					return true; 
				}
			});
		}

		return false;
	},

	isBid: function(){
		if (this.side === 'buy') {
			return true;
		}

		return false;
	},

	isOffer: function(){
		if (this.side === 'sell') {
			return true;
		}

		return false;
	}

});
