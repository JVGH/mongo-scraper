'use strict';
const moment = require('moment');

const register = function(Handlebars) {
	const helpers = {
		ifCond: function(v1, operator, v2, options) {
			switch (operator) {
				case '==':
					return v1 == v2 ? options.fn(this) : options.inverse(this);
				case '===':
					return v1 === v2 ? options.fn(this) : options.inverse(this);
				case '!=':
					return v1 != v2 ? options.fn(this) : options.inverse(this);
				case '!==':
					return v1 !== v2 ? options.fn(this) : options.inverse(this);
				case '<':
					return v1 < v2 ? options.fn(this) : options.inverse(this);
				case '<=':
					return v1 <= v2 ? options.fn(this) : options.inverse(this);
				case '>':
					return v1 > v2 ? options.fn(this) : options.inverse(this);
				case '>=':
					return v1 >= v2 ? options.fn(this) : options.inverse(this);
				case '&&':
					return v1 && v2 ? options.fn(this) : options.inverse(this);
				case '||':
					return v1 || v2 ? options.fn(this) : options.inverse(this);
				default:
					return options.inverse(this);
			}
		},
		join: function(array, sep, options) {
			if (array) {
				return array
					.map(function(item) {
						return options.fn(item);
					})
					.join(sep);
			}
		},
		yell: function(msg) {
			return msg.toUpperCase();
		},
		getLength: function(obj) {
			return obj.length;
		},
		formatDateTime: function(date, format) {
			const mmnt = moment(date);
			return mmnt.format(format);
		},
		capitalizeFirstLetter: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
	};

	if (Handlebars && typeof Handlebars.registerHelper === 'function') {
		// register helpers
		for (let prop in helpers) {
			Handlebars.registerHelper(prop, helpers[prop]);
		}
	} else {
		// just return helpers object if we can't register helpers here
		return helpers;
	}
};

module.exports.register = register;
module.exports.helpers = register(null);
