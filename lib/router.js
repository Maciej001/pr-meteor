Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 
  	return [	Meteor.subscribe('prices'),
  						Meteor.subscribe('bids'),
  						Meteor.subscribe('offers'),
              Meteor.subscribe('trades'),
  					 	Meteor.subscribe('statistics')
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

