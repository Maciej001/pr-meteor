Players = new Mongo.Collection('players');

Players.allow({
	update: function() { return true; },
	remove: function() { return true; },
});

