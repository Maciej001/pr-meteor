// User helpers - thanks to collection-helpers package by dburles

Users = Meteor.users;

Users.helpers({
	isAdmin: function(){
		role =  Roles.userIsInRole(this._id, ['admin']);
		return role;
	},

	contractsBought: function() {
		var buySizesArray,
				buyTrades = Trades.find({ userId: Meteor.userId(), side: 'buy' }).fetch();

		if (buyTrades.length > 0) {
			buySizesArray = _.map(buyTrades, function(trade){
				return trade.size;
			});

			return _.reduce(buySizesArray, function(memo, size){ 
								return memo + size;
							});
		} 
		else {
			return 0;
		}

	},

	contractsSold: function() {
		var sellSizesArray,
				sellTrades = 	Trades.find({ userId: Meteor.userId(), side: 'sell' }).fetch();

		if (sellTrades.length > 0) {
			sellSizesArray = _.map(sellTrades, function(trade){
				return trade.size;
			});

			return _.reduce(sellSizesArray, function(sum, size){ 
								return sum + size;
							});
		} 
		else {
			return 0;
		}
	},

	openPosition: function(){
		return this.contractsBought() - this.contractsSold();
	}
});