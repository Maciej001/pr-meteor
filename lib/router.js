Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
  	return [	Meteor.subscribe('prices'),
  					 	Meteor.subscribe('statistics'), 
  					 	Meteor.subscribe('accounts', Meteor.userId())
  				 ]; 
  }
});

Router.route('/', 'market');

