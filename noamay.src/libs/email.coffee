Email = require('email').Email
_ = require 'underscore'
auth_template = '
	<p><h1>Wellcome: <%=to %></h1></p>
	<p>
		<h3>Authentication successfully complete !</h3>
		Complete your registration follow this activation url:
		<a href="<%=url %>"><%=url %></a>
	</p>'

email = {
	successfuly_auth: (from, to, url) ->
		auth_msg = new Email
			from: from,
			to: to,
			subject: 'Noamay.com authentication'
			bodyType: 'html'
			body: _.template(auth_template,{to:to,url:url})
		auth_msg.send (err) ->
			console.log 'Send email error:', err
}
module.exports = email
