"use strict";

var fs = require('fs');
var path = require('path');
var semver = require('semver');

function FileBundle(filename) {
	this.filename = filename;
	this.data = null;
	this.rootDirectory = path.dirname(filename);
}
FileBundle.prototype.open = function(callback) {
	fs.readFile(this.filename, 'utf-8', function(err, data) {
		if (err) {
			return callback(err);
		}

		var conf = null;
		try {
			conf = JSON.parse(data);
			this.data = conf;
		}
		catch (jsonerr) {
			return callback(new Error("File '" + this.filename + '" is not valid JSON:' + jsonerr.message));
		}

		try {
			this.data = this.verifyData(conf);
		}
		catch (verifyerr) {
			return callback(verifyerr);
		}

		callback(null, this);
	}.bind(this));
};
FileBundle.prototype.verifyData = function(data) {
	if (!data) {
		throw new Error("Invalid bundle data: data must not be null");
	}
	if (typeof(data) !== "object") {
		throw new Error("Invalid bundle data: data must be an object");
	}

	var count = 0;
	Object.keys(data).forEach(function(product) {
		if (typeof(product) !== "string") {
			throw new Error("Invalid bundle data: data must be an object");
		}
		count++;
		if (typeof(data[product]) !== "object") {
			throw new Error("Invalid bundle data: value for product '" + product + "' must be an object");
		}
		if (!data[product]) {
			throw new Error("Invalid bundle data: value for product '" + product + "' must not be null");
		}

		Object.keys(data[product]).forEach(function(version) {
			if (!semver.valid(version)) {
				throw new Error("Invalid bundle data: '" + version + "' in '" + product + "@" + version + "' must be a valid version");
			}
		});
	});

	if (count === 0) {
		throw new Error("Invalid bundle data: no products defined");
	}

	return data;
};
FileBundle.prototype.getProducts = function() {
	if (!this.data) {
		throw new Error('FileBundle must first be opened');
	}

	return Object.keys(this.data);
};
FileBundle.prototype.getVersions = function(productName) {
	if (!this.data) {
		throw new Error('FileBundle must first be opened');
	}

	var product = this.data[productName];
	if (!product) {
		throw new Error("Product '" + productName + "' does not exist.");
	}

	return Object.keys(product);
};
FileBundle.prototype.getUpdateQuery = function(productName, version, callback) {
	if (!this.data) {
		return callback(new Error('FileBundle must first be opened'));
	}

	var product = this.data[productName];
	if (!product) {
		return callback(new Error("Product '" + productName + "' does not exist."));
	}

	var filename = product[version];
	if (!filename) {
		return callback(new Error("Version '" + productName + "@" + version + "' does not exist."));
	}

	var file = path.resolve(this.rootDirectory, filename);

	fs.readFile(file, 'utf-8', function(err, data) {
		if (err) {
			return callback(err);
		}
		return callback(null, data);
	});
};

module.exports = function(filename, callback) {
	var bundle = new FileBundle(filename);
	bundle.open(callback);
};
