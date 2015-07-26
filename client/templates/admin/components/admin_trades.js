
// INITIALIZATION

Template.adminTrades.onCreated(function(){
	var self = this;

	// Initialize
	self.sort = ReactiveVar({});

	// Autorun
	self.autorun(function(){
		self.sort.set(Session.get('sortOrder'));
		var sortOrder = self.sort.get();

		self.data = self.subscribe('trades', { sort: Session.get('sortOrder') });
	});


	// Cursor 
	self.cursor = function(){
		return Trades.find({},  { sort: self.sort.get() });
	}

});


// HELPERS

Template.adminTrades.helpers({
	trades: function(){
		return Template.instance().cursor();
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
		var sortDirection = Session.get('sortDirection')

		$('.table-admin-trades th').removeClass('active-header');
		$(e.target).addClass('active-header');
		
		var sortOrder = {};
		sortOrder[sortBy] = sortDirection;
		Session.set('sortDirection', -sortDirection);

		Session.set('sortOrder', sortOrder);

	}
})

