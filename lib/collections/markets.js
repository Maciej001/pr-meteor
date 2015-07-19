Markets = new Mongo.Collection('markets');

Markets.allow({
	insert: function(userId, doc) { return Meteor.user().isAdmin();	},
	update: function(userId, doc) { return Meteor.user().isAdmin();	}
});

Markets.helpers({
	isOpen: function(){
		if (this.state === "open") {
			return true;
		} 
		else {
			return false
		}
	},

	bestBid: function(){
		return Bids.findOne({}, { sort: { price: -1 } });
	},

	bestOffer: function(){
		return Offers.findOne({}, { sort: { price: 1 } });
	},

});
