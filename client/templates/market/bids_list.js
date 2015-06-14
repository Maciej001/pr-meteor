Template.bidsList.helpers({
	bids: function(){
		return Bids.find({}, {sort: {price: -1}, limit: 5});
	}
});