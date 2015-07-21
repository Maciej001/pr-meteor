Template.adminPanel.onRendered(function(){
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
			closeHour: 				$('#closeHour').val()
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
	
	'click #admin-menu > li': function(e) {
		var name = $(e.target).parent().data('template');
		e.preventDefault();

		$('#admin-menu li').removeClass('active');
		$(e.target).parent().addClass('active');
		Session.set("adminMenu", name);
	}
});

Template.adminPanel.helpers({
	marketState: function(){
		var market = Markets.findOne();
		if (market.state === 'open'){
			return "open";
		} 
		else {
			return "closed";
		}
	},

	activeModal: function() {
		var template = Session.get('adminMenu');

		switch (template) {
			case "all-trades":
				return 'adminTrades';
				break;
			case "all-bids":
				return 'adminBids';
				break;
			case "all-offers":
				return 'adminOffers';
				break;
			case "all-prices":
				return 'adminPrices';
				break;
			case "all-market":
				return 'adminMarket';
				break;
			case "all-portfolio":
				return 'adminPortfolio';
				break;
		}
	}
});
