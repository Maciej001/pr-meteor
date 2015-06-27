Portfolios = new Mongo.Collection('portfolios');

// Create new portfolio after user created
Meteor.users.after.insert(function(userId, doc){
	Portfolios.insert({
		userId: doc._id,
		number_of_trades: 	0,
		contracts_traded: 	0,
		open_position: 			0,
		cash: 							100000
	});
});
