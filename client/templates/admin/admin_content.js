

// INITIALIZE

Template.adminContent.onCreated(function(){
	var self = this;
	var filter = {sort: {}};

	// Initialize;
	self.collection = new ReactiveVar('trades');
	Session.set('sortBy', 'created_at');
	Session.set('sortDirection', 1);

	filter.sort[Session.get('sortBy')] = Session.get('sortDirection');

	self.autorun(function(){

		// Subscribe reactively depending on which tab is active 
		self.data = self.subscribe(self.collection.get(), filter );

	});

});



// HELPERS

Template.adminContent.helpers({
	data: function(){
		// return appropriate data cursor, depending on collection that is subscribed;
		return Template.currentData();
	},
	template: function(){
		// eg admin + trades = adminTrades
		return 'admin' + _(Template.instance().collection.get()).capitalize();
	}
});



// EVENTS

Template.adminContent.events({
	'click #admin-menu > li': function(e, t) {
		e.preventDefault();

		var name = $(e.target).parent().data('template');
		t.collection.set(name);

		// Tab highlight 
		$('#admin-menu li').removeClass('active');
		$(e.target).parent().addClass('active');
	}
});

