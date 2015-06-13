Template.errors.helpers({
	errors: function(){
		return Errors.find();
	}
});

// css fades out each error template. this func removes it from the collection
Template.error.onRendered(function() {
	var error = this.data;
	Meteor.setTimeout(function () {
		Errors.remove(error._id);
	}, 3000);
});
