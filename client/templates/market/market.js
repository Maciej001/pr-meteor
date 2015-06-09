Template.market.helpers({
	newOrderTemplate: function() {
		if (Session.get('newOrder') === true){
			return "newOrderForm";
		} else {
			return "newOrderButton";
		}
	},

});

Template.market.events({
	'click .new-order': function(e){
		e.preventDefault();
		Session.set('newOrder', true);
	},
	'click .cancel-new-order': function(e) {
		e.preventDefault();
		Session.set('newOrder', false);
	},
	'submit form': function(e){
		e.preventDefault();

		var order = {
			price: 				Number($(e.target).find('[type=price]').val()),
			size: 				Number($(e.target).find('[type=size]').val()),
			side: 				$(e.target).find('[value=buy]').is(':checked')  ? "buy" : "sell",
			state: 				"active",
			userId: 			Meteor.userId(),
			created_at: 	Date(),
			updated_at: 	Date()
		};

		order._id = Prices.insert(order);

		Session.set('newOrder', false);
	}


});