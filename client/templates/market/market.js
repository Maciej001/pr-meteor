Template.market.helpers({
	newOrderTemplate: function() {
		if (Session.get('newOrder') === true){
			return "newOrderForm";
		} else {
			return "newOrderButton";
		}
	}
});

Template.market.events({
	'click .new-order': function(e){
		e.preventDefault();
		Session.set('newOrder', true);
	},
	'click .cancel-new-order': function(e) {
		e.preventDefault();
		Session.set('newOrder', false);
	}
});