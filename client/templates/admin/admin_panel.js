

// INITIALIZERS

Template.adminPanel.onCreated(function(){

	// Initialization
	Session.set('sortOrder', { created_at: 1 });
	Session.set('sortDirection', 1);

});


// EVENTS

Template.adminPanel.events({

	'click #open-market': function(e){
		e.preventDefault();

		var market = Markets.findOne();
		Markets.update(market._id, { $set: { state: "open" } });
	},

	'click #close-market': function(e){
		e.preventDefault();

		var market = Markets.findOne();
		Markets.update(market._id, { $set: { state: "closed" } });

		Meteor.call('closeMarket');

	},
	
	'click #remove-prices': function(){
		Meteor.call('removePrices');
	},

	'click #remove-trades': function(){
		Meteor.call('removeTrades');
	}
});



// HELPERS

Template.adminPanel.helpers({
	marketState: function(){
		var market = Markets.findOne();
		if (market.state === 'open'){
			return "OPEN";
		} 
		else {
			return "CLOSED";
		}
	},

	market: function(){
		return Markets.findOne({});
	}

});























