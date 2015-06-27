if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Statistics.find().count() === 0 ) {
			Statistics.insert({
				total_contracts_traded: 	0,
				number_of_trades: 				0,
			});
		}
  });
}