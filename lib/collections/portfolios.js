Portfolios = new Mongo.Collection('portfolios');

Portfolios.allow({
	insert: function(userId, doc){ return true;	},
	update: function(userId, doc){ return true; }
});

// Create new portfolio after user created with initial cash
// here doc = current user
Meteor.users.after.insert(function(userId, doc){

	portfolio_id = Portfolios.insert({
									userId: 							doc._id,
									cash: 								100000,
								});
});