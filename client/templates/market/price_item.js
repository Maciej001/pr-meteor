Template.priceItem.helpers({
	isMyBid: function(){
		var currentUserId = Meteor.userId();
		var pricesIds = this.prices;
		var isMyBid = false;

		if (this.side === 'buy') {
			// Check all Prices connected to given Bid or Offer.
			// Find the price and check if it's userId is same as current user Id
			_.each(pricesIds, function(priceId){
				var price = Prices.findOne(priceId);
				if (price.userId === currentUserId) { 
					isMyBid = true; 
				}
			});

			return isMyBid;
		}

		return false;
	},

	isMyOffer: function(){
		var currentUserId = Meteor.userId();
		var pricesIds = this.prices;
		var isMyOffer = false;

		if (this.side === 'sell') {
			// Check all Prices connected to given Bid or Offer.
			// Find the price and check if it's userId is same as current user Id
			_.each(pricesIds, function(priceId){
				var price = Prices.findOne(priceId);
				if (price.userId === currentUserId) { 
					isMyOffer = true; 
				}
			});

			return isMyOffer;
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