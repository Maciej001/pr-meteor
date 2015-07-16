Template.newOrderForm.onCreated(function() {
	Session.set('orderSubmitErrors', {});
});

Template.newOrderForm.helpers({
	errorMessage: function(field) {
		return Session.get('orderSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('orderSubmitErrors')[field] ? 'has-error' : '';
	}
});

Template.newOrderForm.events({

	'click .cancel-new-order': function(e) {
		e.preventDefault();
		Session.set('newOrder', false);
	},

	'submit form': function(e){
		e.preventDefault();

		var order = {
			price: 				Number($(e.target).find('[type=price]').val()),
			size: 				Number($(e.target).find('[type=size]').val()),
			size_left:    Number($(e.target).find('[type=size]').val()),
			side: 				$(e.target).find('[value=buy]').is(':checked')  ? "buy" : "sell"
		};

		// check for errors on Client side
		var errors = validateOrder(order);
		if (errors.price || errors.size || errors.myself || errors.orderToBig)
			return Session.set('orderSubmitErrors', errors);

		Meteor.call('insertNewOrder', order, function(error, result) {
		// display the error to the user and abort
			if (error)
				return throwError(error.reason);

			// on success change newOrder o false to remove the form view and show button view
			Session.set('newOrder', false);
		});
	}, // 'submit form ends' 
});