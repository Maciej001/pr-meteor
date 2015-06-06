Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 
	myAccount: function(){
		return Accounts.findOne({userId: 'YKXKs5tGZFX9qhAc4'});
	}
});