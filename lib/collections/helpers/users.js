Users = Meteor.users;

Users.helpers({
	isAdmin: function(){
		role =  Roles.userIsInRole(this._id, ['admin']);
		return role;
	},
	openPosition: function(){
		var contractsBought, contractsSold;
		var buyTrades = 	Trades.find({ userId: Meteor.userId(), side: 'buy' }).fetch();
		var sellTrades = 	Trades.find({ userId: Meteor.userId(), side: 'sell' }).fetch();
		var buySizesArray, 
				sellSizesArray,
				contractsBought,
				contractsSold;

		// If there are any 'buy' trades for user
		if (buyTrades.length > 0) {
			buySizesArray = _.map(buyTrades, function(trade){
				return trade.size;
			});

			contractsBought = _.reduce(buySizesArray, function(memo, size){ 
				return memo + size;
			});
		} 
		else {
			contractsBought = 0;
		}

		// If there are any 'sell' trades for user
		if (sellTrades.length > 0) {
			sellSizesArray = _.map(sellTrades, function(trade){
				return trade.size;
			});

			contractsSold = _.reduce(sellSizesArray, function(sum, size){ 
				return sum + size;
			});
		} 
		else {
			contractsSold = 0;
		}

		return contractsBought - contractsSold;
	}
});