define([ 'app', 'marionette', 'views/member/member_home',
		'views/member/member_core', 'views/member/member_list',
		'views/member/member_create', 'views/member/member_import', 'models/member_model' ], function(App, Marionette,
		MemberHomeView, MemberCoreView, MemberListView, MemberCreateView, MemberImportView, Member) {

	return Marionette.Controller.extend({
		home : function() {
			console.log("MemberController.home called");
			GtcOffice.showView(new MemberHomeView());
			GtcOffice.setNav("member.home");
		},

		all : function() {
			GtcOffice.showView(new MemberListView());
			GtcOffice.setNav("member.all");
		},
		
		import : function() {
			console.log("MemberController.import called");
			GtcOffice.showView(new MemberImportView());
			GtcOffice.setNav("member.import");
		},

		applications : function() {
			console.log("MemberController.applications called");
			GtcOffice.showView(new MemberListView({
				listType : "applications"
			}));
			GtcOffice.setNav("member.applications");
		},

		create : function() {
			console.log("MemberController.create called");
			GtcOffice.showView(new MemberCreateView());
			GtcOffice.setNav("member.create");
		},

		current : function() {
			console.log("MemberController.current called");
			GtcOffice.showView(new MemberListView({
				listType : "current"
			}));
			GtcOffice.setNav("member.current");
		},

		view : function(memberId) {
			console.log("MemberController.view called");
			var self = this;
			this.member = new Member({_id: memberId});
			GtcOffice.getProfile().done().then(function(){
				self.member.fetch().done(function(){
					GtcOffice.showView(new MemberCoreView({
						member : self.member
					}));
				}).fail(function(){
					GtcOffice.navigate("#member", true);
				});
			});
			
			GtcOffice.setNav("member.view");
		}
	});

});