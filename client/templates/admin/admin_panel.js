

// INITIALIZERS

Template.adminPanel.onCreated(function(){

	// Initialization
	Session.set('sortOrder', { created_at: 1 });
	Session.set('sortDirection', 1);

});


// EVENTS

Template.adminPanel.events({
	'submit form': function(e){
		var market = Markets.findOne({});

		var actualValue = function(){
					if ($('#actualValue').val() === '' || $('#actualValue').val() === 0 ) {
						return "not available yet";
					} 
					else {
						return Number($('#actualValue').val());
					}
				};

		var closeHour = function(){
					// close market if actual value given
					if ((Number($('#actualValue').val()) > 0) && ($('#closeHour').val() === '' )) {
						var closeTime = new Date();
						return moment(closeTime).format("HH:MM");
					}
					else {
						return $('#closeHour').val();
					}
				}

		e.preventDefault();

		Markets.update({ _id: market._id }, { $set: {
			state: 						market.state,
			estimatedValue: 	Number($('#estimatedValue').val()),
			actualValue: 			actualValue(),
			openHour: 				$('#openHour').val(),
			closeHour: 				closeHour(),
			open: 						$('#mktOpen').val(),
			high: 						$('#mktHigh').val(),
			low: 							$('#mktLow').val(),
			last: 						$('#mktClose').val(),
			multiplier:				$('#mktMultiplier').val(),
			maxPosition:			$('#mktMaxPosition').val(),
		}});

		// If Actual Value
		if ($('#actualValue').val() > 0 ) {
			Markets.update({ _id: market._id }, { $set: { state: 'closed' } });
		}
	},

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

	mktOpen: function(){
		return Markets.findOne().open || '';
	}, 

	mktHigh: function(){
		return Markets.findOne().high || '';
	}, 

	mktLow: function(){
		return Markets.findOne().low || '';
	}, 

	mktLast: function(){
		return Markets.findOne().last || '';
	}, 

	mktMultiplier: function(){
		return Markets.findOne().multiplier || '';
	}, 

	mktEstValue: function(){
		return Markets.findOne().estimatedValue || '';
	}, 

	mktActValue: function(){
		return Markets.findOne().actualValue || '';
	},

	mktMaxPosition: function(){
		return Markets.findOne().maxPosition || '';
	}, 

	mktOpenHour: function(){
		return Markets.findOne().openHour || '';
	}, 

	mktCloseHour: function(){
		return Markets.findOne().closeHour || '';
	}, 

});























