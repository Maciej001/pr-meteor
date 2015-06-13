Errors = new Mongo.Collection(null); // collection on client side only 

throwError = function(message) {
	Errors.insert({ message: message });
};