// function checks if Order belongs to user with 'userId'
ownsOrder = function(userId, doc) {
	return doc && doc.userId === userId;
}

ownsPortfolio = function(userId, doc) {
	return doc && doc.userId === userId;
}