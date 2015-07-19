if (Meteor.isServer) {
  Meteor.startup(function () {
    
  //   // Add Statistics - it contains ONE element
  //   if (Statistics.find().count() === 0 ) {
		// 	Statistics.insert({
		// 		total_contracts_traded: 	0,
		// 		number_of_trades: 				0,
		// 	});
		// }

		if (Meteor.users.find().count() === 0 ) {
			var id = Accounts.createUser({
				email: "maciej@gmail.com",
				password: "korek001"
			});

			Roles.addUsersToRoles(id, ['admin']);
		}	

		// Add Market collection - it contains ONE element
		if (Markets.find().count() === 0) {
			Markets.insert({
				state: "open",
				multiplier: 10,
				maxPosition: 250,
				total_contracts_traded: 0,
				number_of_trades: 0,
			});
		}

  });
}

