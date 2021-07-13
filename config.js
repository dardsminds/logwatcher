let config_data = null
module.exports = function() {
	if(config_data != null && config_data != undefined) {
		return config_data
	}
		
	config_data = {}

	if(process.env.NODE_ENV === undefined || process.env.NODE_ENV == null || process.env.NODE_ENV == 'development') { 
		config_data = require('./config/config.dev.json')
	} else {
	if(process.env.NODE_ENV == 'production') {
		config_data = require('./config/config.prod.json')
	}}

	config_data.port = process.env.port || config_data.port
	
	return config_data
}

