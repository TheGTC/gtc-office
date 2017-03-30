define([ 'marionette', 'text!templates/member/member_tableitem.html' ],
		function(Marionette, MemberTableItemViewTemplate) {

			return Marionette.View.extend({
				template : _.template(MemberTableItemViewTemplate),
				
				tagName : "tr",

				templateContext : function() {
					return {
						membershipNumber : this.model.get("membershipNumber"),
						firstName : this.model.get("firstName"),
						lastName : this.model.get("lastName"),
						type : this.model.get("type"),
						id : this.model.id,
						showMemberNumber : this.showMemberNumber
					};
				},
				
				initialize : function(options)
				{
					this.showMemberNumber = options.showMemberNumber;
				}
			});
		});