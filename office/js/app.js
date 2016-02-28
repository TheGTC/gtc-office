define([ "marionette", "routers/main_router", "routers/member_router",
		"views/header", "views/footer", "views/home", "pace", "underscore",
		"underscore.string", "jquery", "auth0-lock" ], function(Marionette,
		MainRouter, MemberRouter, HeaderView, FooterView, HomeView, pace, _, s,
		$, Auth0Lock) {
	GtcOffice = new Marionette.Application();

	GtcOffice.navigate = function(route, options) {
		options || (options = {});
		Backbone.history.navigate(route, options);
	};

	GtcOffice.getCurrentRoute = function() {
		return Backbone.history.fragment
	};

	GtcOffice.userProfile;

	GtcOffice.startSubApp = function(appName, args) {
		var currentApp = appName ? GtcOffice.module(appName) : null;
		if (GtcOffice.currentApp === currentApp) {
			return;
		}

		if (GtcOffice.currentApp) {
			GtcOffice.currentApp.stop();
		}

		GtcOffice.currentApp = currentApp;
		if (currentApp) {
			currentApp.start(args);
		}
	}

	GtcOffice.lock = new Auth0Lock('y8T1angMINFrNKwwiSec1DDhQaZB7zTq',
			'gtc.eu.auth0.com');

	GtcOffice.on("start", function() {

		// sso requires redirect mode, hence we need to parse
		// the response from Auth0 that comes on location hash
		var hash = GtcOffice.lock.parseHash(window.location.hash);
		if (hash && hash.id_token) {
			// the user came back from the login (either SSO or regular login),
			// save the token
			localStorage.setItem('userToken', hash.id_token);
			// redirect to "targetUrl" if any
			GtcOffice.navigate("#", true);
			return;
		}

		// Get the user token if we've saved it in localStorage before
		var idToken = localStorage.getItem('userToken');
		if (idToken) {
			// If there's a token, just redirect to "targetUrl" if any
			GtcOffice.navigate("#", true);
			return;
		}

		// user is not logged, check whether there is an SSO session or not
		GtcOffice.lock.$auth0.getSSOData(function(err, data) {
			if (!err && data.sso) {
				// there is! redirect to Auth0 for SSO
				GtcOffice.lock.$auth0.signin({
					// If the user wanted to go to some other URL, you can track
					// it with `state`
					state: getQueryParam(location.search, 'targetUrl'),
					callbackOnLocationHash : true
				});
				alert("resuming session");
			} else {
				// regular login
				alert("need to login");
			}
		});

		$.ajaxSetup({
			headers : {
				'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
			}
		});

		pace.start({
		// restartOnRequestAfter: 500
		});

		$(document).on(
				'click a',
				'a:not([data-bypass])',
				function(e) {
					e.preventDefault();
					var link = e.target.attributes.getNamedItem("data-route");
					if (link) {
						var link = e.target.attributes
								.getNamedItem("data-route").value;
						GtcOffice.navigate(link, true);
					}
				});

		var RegionContainer = Marionette.LayoutView.extend({
			el : "#appWrapper",

			regions : {
				header : "#header",
				footer : "#footer",
				content : "#content",
				dialog : "#dialog"
			}

		});
		GtcOffice.regions = new RegionContainer();

		GtcOffice.regions.dialog.onShow = function(view) {
			var self = this;
			var closeDialog = function() {
				self.stopListening();
				self.empty();
				self.$el.dialog("destroy");
			};

			this.listenTo(view, "dialog:close", closeDialog);

			this.$el.dialog({
				modal : true,
				title : view.title,
				width : "auto",
				close : function(e, ui) {
					closeDialog();
				}
			});
		};

		this.regions.getRegion('header').show(new HeaderView());
		this.regions.getRegion('footer').show(new FooterView());

		// Routers
		var mainRouter = new MainRouter();
		var memberRouter = new MemberRouter();

		Backbone.history.start({
			pushState : true,
			root : window.location.pathname.replace('/', '').split('/')[0]
		});
	});

	GtcOffice.setNav = function(location) {
		// Reset nav
		$("li[data-app-location]").removeClass("active");

		// Expand the location
		var path = s.words(location, ".");
		// Set the parent location
		if (path[0] != location) {
			$("li[data-app-location='" + path[0] + "']").addClass("active");
		}
		$("li[data-app-location='" + location + "']").addClass("active");
	};

	GtcOffice.showView = function(view) {
		this.regions.getRegion('content').show(view);
	};

	return GtcOffice;
});