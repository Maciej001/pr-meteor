Template.allTradesItem.helpers({
	isBuy: function(side){
		return side==='buy' ? true : false;
	}, 
	updatedAt: function(time) {
		return moment(this.created_at).format('D MMM, HH:mm:ss');
	}
});