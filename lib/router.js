Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
  	return [	Meteor.subscribe('prices'),
  					 	Meteor.subscribe('statistics'), 
  					 	// Meteor.subscribe('user-accounts', Meteor.userId())
  				 ]; 
  }
});

Router.route('/', 'market');

