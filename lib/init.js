Meteor.startup(function(){
	_.mixin({
	  capitalize: function(string) {
	    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	  }
	});

	// // Opening and closing market 
	// var market = Markets.findOne({});
	// var now = new ReactiveVar()

	// Tracker.autorun(function(){
	// 	if ((now > market.openHour) && (now < market.closeHour)) {
	// 		if (market.state === 'closed') { 
	// 			Markets.update(market._id, { 
	// 				$set { 
	// 					state: 'open' 
	// 				} 
	// 			}); 
	// 		}

	// 		if (Session.equals('marketState', 'closed') {
	// 			Session.set('marketState', 'open');
	// 		}

	// 	}

		
	// });



});