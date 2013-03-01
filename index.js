"use strict";

var fs = require('fs');
var path = require('path');

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

		try {
			var conf = JSON.parse(data);
			this.data = conf;
		}
		catch (jsonerr) {
			return callback(new Error("File '" + this.filename + '" is not valid JSON:' + jsonerr.message));
		}

		callback(null, this);
	}.bind(this));
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
