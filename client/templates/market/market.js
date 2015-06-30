// set the newOrder to false, so that within market 
// only button is displayed and not full form
Template.market.onCreated(function() {
	Session.set('newOrder', false);

});

Template.market.onRendered(function(){
	// Set height of last div so it fills rest of the screen
	var bodyHeight = 		$('body').height();
	var headerHeight = 	50;
	var sessionHeight = this.$("#sessionStatistics").height();
	var pricesHeight = 	this.$("#prices-panel").height();

	var remainingHeight = (bodyHeight - headerHeight - sessionHeight - pricesHeight).toString() + "px";


	console.log('body h ', bodyHeight);
	console.log('headerHeight ', headerHeight);
	console.log('session he ', sessionHeight );
	console.log('prices h ', pricesHeight);

	console.log('remaining height ', remainingHeight);

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
});

Template.market.events({
	'click .new-order': function(e){
		e.preventDefault();
		Session.set('newOrder', true);
	}
});



