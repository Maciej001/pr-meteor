Template.adminPanel.onRendered(function(){
	var statistics = Statistics.findOne();
	console.log('stats ', statistics );
	var currentEstimatedValue = statistics.estimatedValue;

	$('#estimatedValue').val(statistics.estimatedValue);

	if ( _.isNull(statistics.openHour) || _.isUndefined(statistics.openHour)) {
		$('#openHour').val("9:00");
	} else {
		$('#openHour').val(statistics.openHour);
	}

	if ( _.isNull(statistics.closeHour) || _.isUndefined(statistics.closeHour))  {
		$('#closeHour').val("13:30");
	} else {
		$('#closeHour').val(statistics.closeHour);
	}
});

Template.adminPanel.events({
	'submit form': function(e){
		var statistics = Statistics.findOne();

		e.preventDefault();

		Statistics.update({ _id: statistics._id }, { $set: {
			estimatedValue: 	Number($('#estimatedValue').val()),
			actualValue: 			function(){
													if ($('#actualValue').val() === '' || $('#actualValue').val() === 0 ) {
														return "not available yet"
													} else {
														return Number($('#actualValue').val());
													}
												},
			openHour: 				$('#openHour').val(),
			closeHour: 				$('#closeHour').val()
		}});
	}
});

Template.adminPanel.helpers({
	currentTime: function(){
		var time = new Date;
		var time_only = time.getHours() + ":" + time.getMinutes();
		var reactiveTime = new ReactiveVar(time);
		reactiveTime.set(time_only);
		return reactiveTime;
	}
});