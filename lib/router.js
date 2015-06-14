Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
  	return [	Meteor.subscribe('prices'),
  						Meteor.subscribe('bids'),
  						Meteor.subscribe('offers'),
  					 	Meteor.subscribe('statistics'), 
  					 	// Meteor.subscribe('user-accounts', Meteor.userId())
  				 ]; 
  }
});

Router.onBeforeAction(function() {
  if (! Meteor.userId()) {
    this.render('homePage');
  } else {
    this.next();
  }
});

Router.route('/', 'market');

