Template.priceItem.helpers({
	isMyPrice: function(){
		var currentUserId = Meteor.userId();

			// Check if array of userId built from prices id contains currentUserId
			return _.contains(
								_.map(this.prices, function(id){ return Prices.findOne(id).userId }),
								currentUserId);
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
