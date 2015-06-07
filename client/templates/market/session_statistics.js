Template.sessionStatistics.helpers({
	statistics: function(){
		return Statistics.findOne();
	}, 
	userAccount: function(){
		return userAccounts.findOne({userId: 'YKXKs5tGZFX9qhAc4'});
	}
});