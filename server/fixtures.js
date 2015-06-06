if (Prices.find().count() === 0) {
	for (i=1; i < 6; i++) {
		// insert bid
		Prices.insert({
			side: 			'buy',
			state: 			'active',
			price: 			100-i*5,
			size: 			10,
			userId: 		function() {return Meteor.userId()},
			created_at: Date(),
			updated_at: Date()
		});

		// insert offer
		Prices.insert({
			side: 			'sell',
			state: 			'active',
			price: 			100+i*10,
			size: 			10,
			userId: 		function() {return Meteor.userId()},
			created_at: Date(),
			updated_at: Date()
		});
	}
};

if (Statistics.find().count() === 0){
	Statistics.insert({
		total_contracts_traded: 	254,
		number_of_trades: 				32,
		open: 										250,
		high: 										270,
		low: 											230,
		last: 										255
	});
};

if (Accounts.find().count() === 0) {
	Accounts.insert({
		userId: 									'YKXKs5tGZFX9qhAc4',
		trades: 									0,
		contracts_traded: 				0,
		open_position: 						0,
		avg_open_position_price: 	0,
		open_position_value: 			0,
		cash: 										0,
	});
};

