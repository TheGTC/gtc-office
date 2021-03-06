define(
		[ 'underscore', 'underscore.string', 'jquery', 'bootstrap', 'marionette', 'typeahead',
				'bloodhound', 'handlebars', 'text!templates/header.html', 'models/member_model' ],
		function(_, s, $, bootstrap, Marionette, Typeahead, Bloodhound, Handlebars,
				headerTemplate, Member) {

			return Marionette.ItemView
					.extend({
						template : _.template(headerTemplate),
						templateHelpers : function() {
							var nickname = "Guest";
							var userProfile = GtcOffice.userProfile;
							var isLoggedIn = GtcOffice.isLoggedIn;
							var memberInfo = GtcOffice.currentMemberRecord;
							var roles = [];
							
							if (isLoggedIn) {
								nickname = s
										.capitalize(GtcOffice.userProfile.nickname);
							}
							
							if (memberInfo)
							{
								nickname = memberInfo.get("firstName") + " " + memberInfo.get("lastName");
							}
							
							if (userProfile) {
								roles = userProfile.app_metadata.roles;
							}

							return {
								optionalMessage : this.optionalMessage,
								isLoggedIn : isLoggedIn,
								userProfile : userProfile,
								nickname : nickname,
								member : memberInfo,
								roles : roles
							};
						},

						events : {
							"typeahead:select" : "typeaheadSelectMember",
							"click .btn-logout" : "logout",
							'click .btn-login' : 'login'
						},
						
						initialize : function() {
							var self = this;
							var fetchProfile = GtcOffice.getProfile();
							fetchProfile.done(function(){
								self.render();
							});
						},

						login : function(e) {
							e.preventDefault();
							GtcOffice.lock.show(function(err, profile, token) {
								if (err) {
									GtcOffice.navigate("#error/401", true);
								} else {
									// Save the JWT token.
									localStorage.setItem('userToken', token);
									GtcOffice.setAuthHeader();
									// Save the profile
									GtcOffice.isLoggedIn = true;
									GtcOffice.userProfile = profile;
									GtcOffice.navigate("#dash", true);
								}
							});
						},

						logout : function(e) {
							GtcOffice.userProfile = null;
							GtcOffice.currentMemberRecord = null;
							GtcOffice.isLoggedIn = false;
							localStorage.removeItem("userToken");
							GtcOffice.setAuthHeader();
							GtcOffice.navigate("#logout", true);
						},

						typeaheadSelectMember : function(e, suggestion) {
							$('.typeahead').typeahead('val', "");
							GtcOffice.navigate("#member/" + suggestion._id,
									true);
						},

						onShow : function() {
							$('.dropdown-toggle').dropdown();
							this.setupTypeahead();
						},
						
						onRender : function() {
							this.setupTypeahead();
						},
						
						setupTypeahead : function() {
							var membersBloodhound = new Bloodhound(
									{
										datumTokenizer : Bloodhound.tokenizers.obj
												.whitespace('value'),
										queryTokenizer : Bloodhound.tokenizers.whitespace,
										remote : {
											url : GtcOffice.ConfigHandler.getValue("basePath") + 'member/search/%memberNumber',
											wildcard : '%memberNumber',
											cache : false
										}
									});
							$('#member-typeahead')
									.typeahead(
											null,
											{
												hint : true,
												highlight : true,
												minLength : 1,
												name : 'membersTA',
												display : 'membershipNumber',
												source : membersBloodhound,
												templates : {
													empty : [
															'<div class="empty-message">',
															'Unable to find any members that match the current query',
															'</div>' ]
															.join('\n'),
													suggestion : Handlebars
															.compile('<div class="statusColor statusColor-{{status}}"><strong>{{membershipNumber}}</strong> {{firstName}} {{lastName}}<br />Type: {{type}}</div>')
												}
											});
						}
					})
		});