

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


AutoForm.hooks({
	updateMarketForm: {
		// Reads from Mongo in open and close time and returns in form "11:30"
		docToForm: function(doc) {

			if (doc.openHour === null || doc.openHour === undefined || !('openHour' in doc)){ 
				doc.openHour = "";
				
			} else  {
				var openHour = new Date(doc.openHour);
				doc.openHour = 	openHour.getHours() + ':' + openHour.getMinutes();
			}
			
			if (doc.closeHour !== null || doc.closeHour !== undefined || 'closeHour' in doc){ 
				var closeHour = new Date(doc.closeHour);
				doc.closeHour = 	closeHour.getHours() + ':' + closeHour.getMinutes();
			} else  {
				doc.closeHour = "";
			}		

			return doc;

		},
		// From form's "11:30" to new Date with properly set hour  and minutes
		formToDoc: function(doc){
			console.log('before ', doc);
			var openTime = new Date(),
					closeTime = new Date(),
					open = doc.openHour, 
					close = doc.closeHour,
					openHours = 		Number(doc.openHours.substr(0, doc.openHours.indexOf(':'))),
					openMinutes = 	Number(doc.openHours.substr(doc.openHours.indexOf(':'))),
					closeHours = 		Number(doc.closeHours.substr(0, doc.closeHours.indexOf(':'))),
					closeMinutes = 	Number(doc.closeHours.substr(doc.closeHours.indexOf(':')));

			openTime.setHours(openHours);
			openTime.setMinutes(openMinutes);

			closeTime.setHours(closeHours);
			closeTime.setMinutes(closeMinutes);

			doc.openHour = openTime;
			doc.closeHour = closeTime;

			return doc;

		}
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























