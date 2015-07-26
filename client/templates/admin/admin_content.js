

// INITIALIZE

Template.adminContent.onCreated(function(){
	var self = this;
	self.collection = new ReactiveVar('trades');

});



// HELPERS

Template.adminContent.helpers({
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

