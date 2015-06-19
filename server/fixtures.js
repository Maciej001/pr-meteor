Accounts.onLogin(function(user){

	var currentUserId = user.user._id;

	if (Prices.find().count() === 0) {
		for (i=1; i < 6; i++) {
			// insert bid
			Prices.insert({
				side: 			'buy',
				state: 			'active',
				price: 			100-i*5,
				size: 			10,
				size_left: 	10,
				userId: 		currentUserId,
				created_at: Date(),
				updated_at: Date()
			});

			Bids.insert({
				side: 			'buy',
				state: 			'active',
				price: 			100-i*5,
				size: 			10,
				size_left: 	10,
				userId: 		currentUserId,
				created_at: Date(),
				updated_at: Date()
			});

			// insert offer
			Prices.insert({
				side: 			'sell',
				state: 			'active',
				price: 			100+i*10,
				size: 			10,
				size_left: 	10,
				userId: 		currentUserId,
				created_at: Date(),
				updated_at: Date()
			});

			Offers.insert({
				side: 			'sell',
				state: 			'active',
				price: 			100+i*10,
				size: 			10,
				size_left: 	10,
				userId: 		currentUserId,
				created_at: Date(),
				updated_at: Date()
			});
		}
	};




	if (Statistics.find().count() === 0 ){

		Statistics.insert({
			total_contracts_traded: 	254,
			number_of_trades: 				32,
			open: 										250,
			high: 										270,
			low: 											230,
			last: 										255
		});
	};

});





