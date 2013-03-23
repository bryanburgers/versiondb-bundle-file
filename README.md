# VersionDB File Bundle

Used by VersionDB to read in a schema.json file.

[![Build Status](https://secure.travis-ci.org/bryanburgers/versiondb-bundle-file.png)](http://travis-ci.org/bryanburgers/versiondb-bundle-file)

## Usage

    var filebundle = require('versiondb-bundle-file');
    filebundle('path/to/schema.json', function(err, bundle) {
        // bundle conforms to bundle interface that VersionDB requires
    });

## File Format

A File Bundle consists of a .json file any number of corresponding .sql files. The .json file conforms to a specific schema.

The .json file is an object, where each key is the name of the product. Each value of a product is again an object, where each key is a valid `semver` version, and the corresponding value is a filename. The filename is relative to the .json file.

### Example

In this example, we have the following files in a single directory.

    schema.json
    product1-1.0.0.sql
    product1-1.0.1.sql
    product1-1.0.2.sql
    product2-1.0.0.sql
    product2-2.0.0.sql
    
Our `schema.json` file might look like this:

    {
        "product1": {
            "1.0.0": "product1-1.0.0.sql",
            "1.0.1": "product1-1.0.1.sql",
            "1.0.2": "product1-1.0.2.sql"
        },
        "product2": {
            "1.0.0": "product2-1.0.0.sql",
            "2.0.0": "product2-2.0.0.sql"
        }
    }
