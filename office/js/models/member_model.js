define([ 'models/base_model' ], function(BaseModel) {

	return BaseModel.extend({
		url : function() {
			return this.urlRoot() + "member/id/" + this.id;
		},

		createMember : function(callback) {
			var oldUrl = this.url;
			this.url = new BaseModel().urlRoot() + "member/";
			this.save(
				this.attributes,
				{
					success : function(model, response)
					{
						callback(model, response);
					}
				}
			);
			this.url = oldUrl;
		},
		
		getMailchimpStatus : function() {
			var memberReference = (GtcOffice.currentMemberRecord && GtcOffice.currentMemberRecord.id) == this.id ? "me" : this.id;
			return this.getJsonData("member/" + memberReference + "/mailchimp/status");
		},
		
		subscribeToMailchimp : function() {
			var memberReference = (GtcOffice.currentMemberRecord && GtcOffice.currentMemberRecord.id) == this.id ? "me" : this.id;
			return this.getJsonData("member/" + memberReference + "/mailchimp/subscribe");
		},
		
		getMyMember : function(callback) {
			var oldUrl = this.url;
			this.url = new BaseModel().urlRoot() + "member/me";
			var options = {};
			options.success = function(model, response){
				callback(model, response);
			}
			this.fetch(options);
			this.url = oldUrl;
		},
		
		getMemberByNumber : function(model, callback) {
			var oldUrl = this.url;
			this.url = new BaseModel().urlRoot() + "member/" + model.get("membershipNumber");
			this.sync(
				"read",
				model,
				this.attributes,
				{
					success : function(model, response)
					{
						callback(model, response);
					}
				}
			);
			this.url = oldUrl;
		},
		
		getNextMembershipNumber : function() {
			return this.getPlainData("member/nextMemberNumber", false);
		},

		getMemberTypes : function(cache) {
			return this.getPlainData("member/memberTypes", cache);
		},
		
		getSalutations : function(cache) {
			return this.getPlainData("member/salutationTypes", cache);
		},

		getLocations : function(cache) {
			return this.getPlainData("member/locationTypes", cache);
		},

		getStatuses : function(cache) {
			return this.getPlainData("member/statusTypes", cache);
		},
		
		importMembers : function(data, callback) {
			// Use $ for upload - investigate Backbone.sync/ajax in the future
			$.ajax({
			    url: new BaseModel().urlRoot() + "member/upload",
			    data: data,
			    type: 'POST',
			    contentType: false,
			    processData: false,
			})
			.fail(function(data)
			{
				callback(data, true);
			})
			.done(function(data)
			{
				callback(data, false);
			});
		}
	});

});