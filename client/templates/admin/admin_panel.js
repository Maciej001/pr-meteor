

// INITIALIZERS

Template.adminPanel.onCreated(function(){

	Session.set('sortOrder', { created_at: 1 });
	Session.set('sortDirection', 1);

}); // onCreated ends




// EVENTS

Template.adminPanel.events({

	'click #open-market': function(e){
		e.preventDefault();

		// set openHour to now  and closeHour to now plus 15 minutes
		var now = new Date(), 
				hour = now.getHours(),
				minutes = now.getMinutes(),
				minutes_plus = minutes + 15;

		var market = Markets.findOne();
		Markets.update(market._id, { $set: { 
					state: "open", 
					openHour: hour + ":" + minutes,
					closeHour: hour + ":" + minutes_plus
				} 
		});
	},

	'click #close-market': function(e){
		e.preventDefault();

		var market = Markets.findOne();
		Markets.update(market._id, { $set: { 
				state: "closed",
				openHour: "",
				closeHour: ""
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
	}

});


// AUTOFORM HOOKS

AutoForm.hooks({
	updateMarketForm: {

		// Store Actual Value in Session variable so onSuccess can use it
		before: {
			update: function(doc) {
				var actualValue = doc.$set.actualValue;
				if ( actualValue !== '' && !_.isUndefined(actualValue) ) {
					Session.set('ActualValue', doc.$set.actualValue);
				} else {
					Session.set('ActualValue', '');
				}
				return doc;
			}
		},

		// If form submitted successfully
		onSuccess: function(error, result) {
			var actualValue = Session.get('ActualValue');
			if (result &&  actualValue !== '') {
				console.log('actualValue', actualValue);
			} else {
				console.log('dupa nie ma nic!');
			}
		}
	}
});























