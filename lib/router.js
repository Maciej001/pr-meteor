Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { 

    if (Meteor.userId()) {
    	return [	Meteor.subscribe('prices'),
    						Meteor.subscribe('bids'),
    						Meteor.subscribe('offers'),
                Meteor.subscribe('trades'),
    					 	Meteor.subscribe('statistics'),
                Meteor.subscribe('portfolios')
    				 ]; 
    } 
  }, 

  data: function(){
    return [  Prices.find({}),
              Bids.find({}),
              Offers.find({}),
              Trades.find({}),
              Statistics.find({}),
              Portfolios.find({ userId: Meteor.userId() })
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

