if (Prices.find().count() === 0) {
	for (i=1; i < 6; i++) {
		// insert bid
		Prices.insert({
			side: 			'buy',
			state: 			'active',
			price: 			100-i*10,
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
}