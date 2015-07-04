// regex to match time HH:MM ^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$
TimeToTodayDate = function(timeString) {
	var hour, minute;
	var today = new Date();

	hour = timeString.substring(0, timeString.indexOf(':') );
	minute = timeString.substring( timeString.indexOf(':') + 1);

	return new Date( today.getFullYear(), today.getMonth(), today.getDate(), hour, minute);
}
