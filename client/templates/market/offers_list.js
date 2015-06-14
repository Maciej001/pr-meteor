Template.offersList.helpers({
	offers: function(){
		return Offers.find({}, {sort: {price: 1}, limit: 5});
	}
});