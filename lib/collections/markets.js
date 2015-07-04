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
	}
});