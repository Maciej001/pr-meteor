Portfolios = new Mongo.Collection('portfolios');

Portfolios.allow({
	update: function(userId, doc){ return true;}
});

// Create new portfolio after user created
// here doc = current user
Meteor.users.after.insert(function(userId, doc){
	Portfolios.insert({
		userId: 							doc._id,
		number_of_trades: 		0,
		contracts_traded: 		0,
		open_position: 				0,
		cash: 								100000,
		revalPrice: 					0,
		avgOpenPositionPrice: 0,
		openPositionValue: 		0,
		totalAccountValue: 		100000
	});
});


