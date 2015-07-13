Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 

    if (Meteor.userId()) {
    	return [	
                Meteor.subscribe('allUsers'),
                // Meteor.subscribe('prices'),
    						Meteor.subscribe('bids'),
    						Meteor.subscribe('offers'),
                Meteor.subscribe('trades'),
    					 	Meteor.subscribe('statistics'),
                Meteor.subscribe('portfolios'),
                Meteor.subscribe('markets'),
                Meteor.subscribe('prices')
    				 ]; 
    } else {
      return [  Meteor.subscribe('markets'),];
    }
  }, 

  data: function(){
    return [  
              Prices.find({}),
              Bids.find({}),
              Offers.find({}),
              Trades.find({}),
              Statistics.find({}),
              Portfolios.find({ userId: Meteor.userId() }),
              Markets.find({}),
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

Router.route('/', function(){
  this.render('market');
  Meteor.subscribe('prices');
});

Router.route('/market', function(){

  this.render('market');
  Meteor.subscribe('prices');
});

Router.route('/all-trades', function(){
  this.render('allTrades');
});

Router.route('/all-orders', function(){
  this.render('allOrders');
  Meteor.subscribe('all-prices');
});


Router.route('/admin', function(){
  user = Meteor.user();
  if (user.isAdmin()) {
    this.render('adminPanel');
  } else {
    this.redirect('/');
  }
});





