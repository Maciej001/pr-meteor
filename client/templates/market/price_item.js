Template.priceItem.helpers({
	myPrice: function(){
		return !!(Meteor.userId() === this.userId);
	}
});