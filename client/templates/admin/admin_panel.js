// INITIALIZERS

Template.adminPanel.onCreated(function(){

	Session.set('sortOrder', { created_at: 1 });
	Session.set('sortDirection', 1);

}); // onCreated ends



// EVENTS

Template.adminPanel.events({

	'click #open-market': function(e){
		e.preventDefault();

		// set openHour to now and closeHour to now plus 15 minutes
		var now = new Date(), 
				timezoneOffset = now.getTimezoneOffset();

		now.setHours(now.getHours() + timezoneOffset/60);

		var market = Markets.findOne(),
				in15Minutes = new Date(now.getTime());

		in15Minutes.setMinutes(in15Minutes.getMinutes() + 15);

		Markets.update(market._id, { $set: { 
					state: "open", 
					openingHour: now,
					closingHour: in15Minutes,
					actualValue: ''
				} 
		});
	},

	'click #close-market': function(e){
		e.preventDefault();

		var market = Markets.findOne();
		Markets.update(market._id, { $set: { 
				state: "closed",
				openingHour: "",
				closingHour: ""
			} 
		});
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
	},

	openingHour: function(){
		var market = Markets.findOne();

		if (market.openingHour !== "") {

			var openingHour = market.openingHour,
			clientTime = new Date();

			openingHour.setHours(market.openingHour.getHours() - clientTime.getTimezoneOffset()/60);

			return openingHour.getHours() + ":" + openingHour.getMinutes();

		} else {
		
			return "";		
		}
	},

	closingHour: function(){
		var market = Markets.findOne();

		if (market.closingHour !== "") {
			closingHour = market.closingHour,
			clientTime = new Date();

			closingHour.setHours(market.closingHour.getHours() - clientTime.getTimezoneOffset()/60);

			return closingHour.getHours() + ":" + closingHour.getMinutes();
		} else {

			return "";
		}
	}

});


// AUTOFORM HOOKS

var getDateFromTimeString = function(time) {
		var hour = Number(time.substr(0, time.indexOf(':'))),
		minutes = Number(time.substr(time.indexOf(':') + 1)),
		new_time = new Date();

		new_time.setHours(hour);
		new_time.setMinutes(minutes);
		new_time.setSeconds(0);
		new_time.setMilliseconds(0);

		return new_time;
	}

AutoForm.hooks({
	updateMarketForm: {

		before: {
			update: function(doc) {
				var	clientTime = new Date(),
						timezoneOffset = clientTime.getTimezoneOffset();

				if (doc.$set.openHour) {
					var openHour = getDateFromTimeString(doc.$set.openHour);  

					openHour.setHours(openHour.getHours() + timezoneOffset/60);
					doc.$set.openingHour = openHour;
				}

				if (doc.$set.closeHour) {
					var closeHour	= getDateFromTimeString(doc.$set.closeHour);

					closeHour.setHours(closeHour.getHours() + timezoneOffset/60);
					doc.$set.closingHour = closeHour;
				}

				// reset openHour and closeHour to ''
				doc.$set.openHour = '';
				doc.$set.closeHour = '';

				var actualValue = doc.$set.actualValue;

				if ( actualValue !== '' && !_.isUndefined(actualValue) ) {
					Session.set('ActualValue', doc.$set.actualValue);
				} else {
					Session.set('ActualValue', '');
				}

				return doc;
			}
		},
	}
});























