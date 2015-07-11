Portfolios = new Mongo.Collection('portfolios');

Portfolios.allow({
	insert: function(userId, doc){ return true; },
	update: function(userId, doc){ return true; }
});

// Create new portfolio after user created
// here doc = current user
Meteor.users.after.insert(function(userId, doc){

	portfolio_id = Portfolios.insert({
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

	var email = doc.emails[0].address,
			name =  email.substring(0, email.indexOf('@'));


	// Create 'player' in Players collection, that is used to list top players.
	Players.insert({
		userId: 							doc._id,  // User's id
		portfolioId: 					portfolio_id,
		name: 								name,
		totalAccountValue:    Portfolios.findOne(portfolio_id).totalAccountValue
	})
});

