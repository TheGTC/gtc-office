define([ 'marionette', 'views/home', 'views/dash', 'views/error' ], function(
		Marionette, HomeView, DashView, ErrorView) {

	return Marionette.Controller.extend({
		home : function() {
			console.log("MainController.home called");
			GtcOffice.getProfile().done(function() {
				if (GtcOffice.isLoggedIn) {
					GtcOffice.navigate("#dash", true);
				} else {
					GtcOffice.showView(new HomeView());
					GtcOffice.setNav("home");
				}
			});
		},

		dash : function() {
			console.log("MainController.dash called");
			GtcOffice.getProfile().done(function() {
				if (GtcOffice.isLoggedIn) {
					GtcOffice.regions.getRegion('header').currentView.render();
					GtcOffice.showView(new DashView());
					GtcOffice.setNav("dash");
				} else {
					GtcOffice.navigate("#", true);
				}
			});
		},

		logout : function() {
			GtcOffice.showView(new HomeView({
				optionalMessage : "Logout completed."
			}))
			GtcOffice.regions.getRegion('header').currentView.render();
			GtcOffice.navigate("#", true);
		}
	});

});