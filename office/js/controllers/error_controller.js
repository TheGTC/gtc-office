define([ 'marionette', 'views/error' ], function(
		Marionette, ErrorView) {

	return Marionette.Controller.extend({
		404 : function(path) {
			console.log("ErrorController.404 called");
			GtcOffice.setNav("error/404");
			this.error("404", path);
		},
		
		error : function(errorCode, extra) {
			console.log("ErrorController.error called");
			var detailedMessage = "An error occurred.";
			switch(errorCode)
			{
			case "404":
				detailedMessage = "That page doesn't exist: " + extra;
				break;
			case "502":
				detailedMessage = "The office is unavailable. Contact support via the footer.";
				break;
			default:
				break;
			}
			
			var options = {
					errorCode : errorCode,
					message : detailedMessage
			}
			GtcOffice.showView(new ErrorView(options));
			GtcOffice.setNav("dash");
		}
	});

});