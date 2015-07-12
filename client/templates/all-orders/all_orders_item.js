Template.allOrdersItem.helpers({
	isBuy: function(side){
		return side==='buy' ? true : false;
	}, 
	updatedAt: function(time) {
		return moment(this.created_at).format('D MMM, HH:mm:ss');
	}, 
	currentState: function() {
		if (this.state === 'active') {
			return 'order-active'
		}
	}, 
	isOrderActive: function() {
		if (this.state === 'active') {
			return true;
		}

		return false;
	}
});