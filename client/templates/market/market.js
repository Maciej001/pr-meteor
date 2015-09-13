// set the newOrder to false, so that within market 
// only button is displayed and not full form
Template.market.onCreated(function() {
	Session.setDefault('newOrder', false);

	Tracker.autorun( function(){
		var market = Markets.findOne({});
		if (new Date(Session.get("currentTime")) > market.closeHour) {
				Markets.update(market, { $set: { state: 'closed' } });
		}
	});

});

Template.market.onRendered(function(){
	// Set height of last div so it fills rest of the screen
	var bodyHeight = 		$('body').height();
	var headerHeight = 	50;
	var sessionHeight = this.$("#sessionStatistics").height();
	var pricesHeight = 	this.$("#prices-panel").height();
	var remainingHeight = (bodyHeight - headerHeight - sessionHeight - pricesHeight).toString() + "px";

	$("#my-activity").css("min-height", remainingHeight );
});

Template.market.helpers({
	newOrderTemplate: function() {
		if (Session.get('newOrder') === true){
			return "newOrderForm";
		} else {
			return "newOrderButton";
		}
	},

	currentTime: function(){
		// return moment.tz(Session.get('currentTime'), "Europe/London").format("HH:mm:ss");
		return moment(Session.get('currentTime')).format("HH:mm:ss");
	},

	openPosition: function(){
		if (Meteor.user()){
			var market = Markets.findOne();

			// If actualValue is known open position is 0 -> 'square'
			if (market.actualValue !== '' && !_.isUndefined(market.actualValue)) {
				return 'square'
			} 
			else {
				var openPosition = Meteor.user().openPosition();

				if (openPosition === -1) {
					return " 1 contract short";
				} 
				else if (openPosition < -1) {
					return Math.abs(openPosition) + " contracts short";
				}
				else if (openPosition === 0) {
					return " square";
				} 
				else if (openPosition === 1) {
					return " 1 contract long";
				} 
				else {
					return openPosition + " contracts long";
				}
			}
		}

	},

	marketOpen: function(){
		var market = Markets.findOne({});

		return market.isOpen();
	}
});

Template.market.events({
	'click .new-order': function(e){
		e.preventDefault();
		Session.set('newOrder', true);
	}
});



