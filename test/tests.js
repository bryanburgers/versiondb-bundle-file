var bundle = require('../');
var should = require('should');

describe('File Bundle', function() {
	describe('open', function() {
		it('opens an existing file correctly', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				should.not.exist(err);
				should.exist(bundle);
				bundle.should.have.property('getProducts');
				bundle.should.have.property('getVersions');
				bundle.should.have.property('getUpdateQuery');

				done();
			});
		});

		it('throws an error on a non-existent file', function(done) {
			bundle('test/files/non-existent.json', function(err, bundle) {
				should.exist(err);

				done();
			});
		});

		it('throws an error on a non-json file', function(done) {
			bundle('test/files/test-1.0.0.sql', function(err, bundle) {
				should.exist(err);

				done();
			});
		});

		it('throws an error for incorrect json file - not an object', function(done) {
			bundle('test/files/array.json', function(err, bundle) {
				should.exist(err);

				done();
			});
		});

		it('throws an error for incorrect json file - products not objects', function(done) {
			bundle('test/files/productsNotObjects.json', function(err, bundle) {
				should.exist(err);

				done();
			});
		});

		it('throws an error for incorrect json file - product is null', function(done) {
			bundle('test/files/productNull.json', function(err, bundle) {
				should.exist(err);

				done();
			});
		});

		it('throws an error for incorrect json file - invalid versions', function(done) {
			bundle('test/files/invalidVersions.json', function(err, bundle) {
				should.exist(err);

				done();
			});
		});
	});

	describe('getProducts', function() {
		it('returns the correct products (1)', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				var products = bundle.getProducts();
				products.should.eql(["test"]);

				done();
			});
		});

		it('returns the correct products (2)', function(done) {
			bundle('test/files/multiple.json', function(err, bundle) {
				var products = bundle.getProducts();
				products.should.eql(["test", "other"]);

				done();
			});
		});
	});

	describe('getVersions', function() {
		it('returns the correct versions (1)', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				var versions = bundle.getVersions("test");
				should.exist(versions);
				versions.should.eql(["1.0.0", "1.0.1"]);

				done();
			});
		});

		it('returns the correct products (2)', function(done) {
			bundle('test/files/multiple.json', function(err, bundle) {
				var versions = bundle.getVersions("other");
				should.exist(versions);
				versions.should.eql(["2.0.0"]);

				done();
			});
		});

		it('throws for an invalid product', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				(function() {
					var versions = bundle.getVersions("nonexistent");
				}).should.throwError(/does not exist/);

				done();
			});
		});
	});

	describe('getUpdateQuery', function() {
		it('returns the correct data', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				bundle.getUpdateQuery("test", "1.0.0", function(err, query) {
					should.not.exist(err);
					query.should.match(/SELECT \* FROM test/i);

					done();
				});
			});
		});

		it('returns error for an invalid product', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				bundle.getUpdateQuery("nonexistent", "1.0.0", function(err, query) {
					should.exist(err);

					done();
				});
			});
		});

		it('returns error for an invalid version', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				bundle.getUpdateQuery("test", "47.0.0", function(err, query) {
					should.exist(err);

					done();
				});
			});
		});

		it('returns error for an unfound file', function(done) {
			bundle('test/files/test.json', function(err, bundle) {
				bundle.getUpdateQuery("test", "1.0.1", function(err, query) {
					should.exist(err);

					done();
				});
			});
		});
	});
});
