Template.header.helpers({
	youAreAdmin: function() {
		return (Meteor.user().emails[0].address === 'maciej@gmail.com');
	}
});