

// INITIALIZERS

Template.adminPanel.onCreated(function(){

	// Initialization
	Session.set('sortOrder', { created_at: 1 });
	Session.set('sortDirection', 1);

	var market = Markets.findOne();
	var currentEstimatedValue = Markets.estimatedValue;

	$('#estimatedValue').val(market.estimatedValue);

	if ( _.isNull(market.openHour) || _.isUndefined(market.openHour)) {
		$('#openHour').val("9:00");
	} else {
		$('#openHour').val(market.openHour);
	}

	if ( _.isNull(market.closeHour) || _.isUndefined(market.closeHour))  {
		$('#closeHour').val("13:30");
	} else {
		$('#closeHour').val(market.closeHour);
	}
});


// EVENTS

Template.adminPanel.events({
	'submit form': function(e){
		var market = Markets.findOne({});

		e.preventDefault();

		Markets.update({ _id: market._id }, { $set: {
			estimatedValue: 	Number($('#estimatedValue').val()),
			actualValue: 			function(){
													if ($('#actualValue').val() === '' || $('#actualValue').val() === 0 ) {
														return "not available yet"
													} else {
														return Number($('#actualValue').val());
													}
												},
			openHour: 				$('#openHour').val(),
			closeHour: 				$('#closeHour').val(),
			open: 						$('#mktOpen').val(),
			high: 						$('#mktHigh').val(),
			low: 							$('#mktLow').val(),
			last: 						$('#mktClose').val(),
			multiplier:				$('#mktMultiplier').val(),
			maxPosition:			$('#mktMaxPosition').val(),
		}});
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























