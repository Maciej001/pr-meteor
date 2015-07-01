Statistics = new Mongo.Collection('statistics');

Statistics.allow({
	update: function() { return true; }
});