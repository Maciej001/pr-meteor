Template.myOrderItem.helpers({
	isBuy: function(side){
		return side==='buy' ? true : false;
	}, 
	updatedAt: function(time) {
		return moment(time).format('D MMM, HH:mm:ss');
	}
});