Users = Meteor.users;

Users.helpers({
	isAdmin: function(){
		role =  Roles.userIsInRole(this._id, ['admin']);
		console.log('checking admin right, is admin: ', role);
		return role;
	}
});