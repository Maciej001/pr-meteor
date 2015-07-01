Template.header.helpers({
	youAreAdmin: function() {
		var cUser = Meteor.user();
		return (cUser.emails[0].address === 'maciej@gmail.com');
	}
});