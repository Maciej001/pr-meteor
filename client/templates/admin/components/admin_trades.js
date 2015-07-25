
// HELPERS

Template.adminTrades.helpers({
	trades: function(){
		return Trades.find();
	},
	userName: function(){
		var email = Meteor.users.findOne({_id: this.userId}).emails[0].address;

		return _(email.split('@')[0]).capitalize();
	},
	tradeDate: function(){
		return moment(this.created_at).format("DD/MM/YY, HH:mm:ss");
	},

});


// EVENTS

Template.adminTrades.events({
	'click .delete-trade': function(){
		Trades.remove(this._id);
	},
	'click th': function(e,t){
		var sortBy = $(e.target).data('sort');
		var sortDirection = Session.get('sortDirection');
		
		Session.set('sortBy', sortBy);
		Session.set('sortDirection', (- sortDirection));

		console.log(Session.get('sortBy'));
		console.log(Session.get('sortDirection'));
	}
})
