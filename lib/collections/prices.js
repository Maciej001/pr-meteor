Prices = new Mongo.Collection('prices');

Prices.allow({
	insert: function(userId, doc) {
	// only allow placing new order if you are logged in
		return !! userId;
	}
});