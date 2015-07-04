Markets = new Mongo.Collection('markets');

Markets.allow({
	insert: function(userId, doc) {return true},
	update: function(userId, doc) { 
		return Meteor.user().isAdmin();
	},
});

Markets.helpers({
	isOpen: function(){
		var market = Markets.findOne();
		if (market.state === 'open') {
			return true;
		}
		else {
			return false;
		}
	},
	isClosed: function(){
		var market = Markets.findOne();
		if (market.state === 'closed') {
			return true;
		}
		else {
			return false;
		}
	},
	bestBid: function(){
		return Bids.findOne({}, { sort: { price: -1 } });
	},
	bestOffer: function(){
		return Offers.findOne({}, { sort: { price: 1 } });
	},
	topPlayers: function(){
		user = Players.findOne();

		var portfolios = Portfolios.find({}, {sort: {price: -1}, limit: 5}).fetch();

		return  _.map(portfolios, function(portfolio){
							var user  = Players.findOne({ _id: portfolio.userId });

							return {
								email: 						user.emails[0].address,
								totalValuation: 	portfolio.totalAccountValue
							}

		});
	}
});
