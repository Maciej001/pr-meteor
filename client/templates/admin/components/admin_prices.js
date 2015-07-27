
// INITIALIZAITON

Template.adminPrices.onCreated(function(){
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
	self.cursor = function() {
		return Prices.find({}, { sort: self.sort.get() });
	}

});


// HELPERS

Template.adminPrices.helpers({
	prices: function(){
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

Template.adminPrices.events({

	'click .delete-trade': function(){
		var order = Prices.findOne({ _id: this._id });

		// Remove order from Bids or Offers collection
		if (order.side === 'buy') {
			
			var bid = Bids.findOne({ prices: order._id });

			// If order and bid size left the same,
			// It is the only order of the bid
			// If you delete the order, delete the bid as well
			if (bid.size_left === order.size_left) {
				Bids.remove({ _id: bid._id })
			}
			else {
				Bids.update({ _id: bid._id }, 
					{ $inc:  { size_left: -order.size_left },
					  $pull: { prices: order._id } 
					}
				);
			}


		}
		else {
			var offer = Offers.findOne({ prices: order._id });

			if (offer.size_left === order.size_left) {
				Offers.remove({ _id: offer._id })
			}
			else {
				Offers.update({ _id: offer._id },
					{ $inc: 	{ size_left: -order.size_left},
						$pull: 	{ prices: order._id }
					}
				);
			}	
		}

		// Remove order
		Prices.remove(this._id);
	},

	'click th': function(e,t){
		var sortBy = $(e.target).data('sort');
		var sortDirection = Session.get('sortDirection');

		$('.table-admin-prices th').removeClass('active-header');
		$(e.target).addClass('active-header');

		$('.table-admin-prices td').removeClass('active-cell');
		$(".table-admin-prices td[data-sort=" + sortBy + "]").addClass('active-cell');
		
		var sortOrder = {};
		sortOrder[sortBy] = sortDirection;
		Session.set('sortDirection', -sortDirection);

		Session.set('sortOrder', sortOrder);
	}
})
