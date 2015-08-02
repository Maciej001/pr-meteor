Markets = new Mongo.Collection('markets');

Markets.attachSchema( new SimpleSchema({
	state: {
		type: String,
		label: "State",
		allowedValues: ["open", "closed"]
	},
	estimatedValue: {
		type: Number,
		label: "Estimated Value",
		min: -2000, // lowest historic -1966 (Sep 1945)
		max: 1500,  // highest historic was 1114 (Sep 1983)
		optional: true
	},
	actualValue: {
		type: Number,
		label: "Actual Value",
		min: -2000,
		max: 1500, 
		optional: true
	},
	open: {
		type: Number,
		label: "Open",
		min: -2000,
		max: 1500,
		optional: true
	},
	high: {
		type: Number,
		label: "High",
		min: -2000,
		max: 1500,
		optional: true
	},
	low: {
		type: Number,
		label: "Low",
		min: -2000,
		max: 1500,
		optional: true
	},
	last: {
		type: Number,
		label: "Last",
		min: -2000,
		max: 1500,
		optional: true
	},
	openHour: {
		type: String,
		label: "Opening Hour",
		regEx: /([01]?[0-9]|2[0-3]):[0-5][0-9]/,
		optional: true
	},
	closeHour: {
		type: String,
		label: "Closing Hour",
		regEx: /([01]?[0-9]|2[0-3]):[0-5][0-9]/,
		optional: true
	},
	multiplier: {
		type: Number,
		label: "Multiplier",
		min: 1
	},
	maxPosition: {
		type: Number,
		label: "Maximum Position",
		optional: true
	}


}));

Markets.allow({
	insert: function(userId, doc) { return Meteor.user().isAdmin();	},
	update: function(userId, doc) { return Meteor.user().isAdmin();	}
});

Meteor.methods({
	closeMarket: function(){
		if (Meteor.user().isAdmin()) {
			console.log("closing market");
		}
	}
})

Markets.helpers({
	market: function(){
		return Markets.findOne({});
	},
	isOpen: function(){
		if (this.state === "open") {
			return true;
		} 
		else {
			return false
		}
	},

	bestBid: function(){
		return Bids.findOne({}, { sort: { price: -1 } });
	},

	bestOffer: function(){
		return Offers.findOne({}, { sort: { price: 1 } });
	},

});
