var restylingApp = angular.module('restylingApp');

function Schema(data, attrs, nodeAttrs, ids, mappings) {
    this.data = data;
    this.attrs = attrs;

    var columnData = [];
    _.each(data, function(val, key) {
        columnData.push({
            name: key,
            data: val
        });
    });
    _.each(attrs, function(val, key) {
        columnData.push({
            name: key,
            data: val
        });
    });

    this.numFields = Object.keys(data).length;
    this.ids = ids;
    this.mappings = mappings;
    this.nodeAttrs = nodeAttrs;
}

Schema.prototype.updateWithMessage = function(updateMessage) {
    var val = updateMessage.val;
    var attr = updateMessage.attr;
    var schema = this;
    _.each(updateMessage.ids, function(id, ind) {
        schema.attrs[attr][ind] = val;

        if (attr === "area") {
            schema.attrs["width"] = Math.sqrt(val);
        }
        else if (attr === "width" || attr === "height") {
            schema.attrs["area"] = schema.attrs["width"][ind]
                * schema.attrs["height"][ind];
        }
    });
};

Schema.prototype.attrIsMapped = function(attr) {
    return _.find(this.mappings, function(mapping) {
        return mapping.attr == attr;
    }) !== undefined;
};

Schema.prototype.uniqVals = function(fieldName, isAttr) {
    var allVals;
    if (isAttr) {
        allVals = this.attrs[fieldName];
    }
    else {
        allVals = this.data[fieldName];
    }
    return _.uniq(allVals);
};

Schema.prototype.getDataCSVBlob = function() {
    var keys = Object.keys(this.data);
    console.log(keys);
    var dataLen = this.data[keys[0]].length;
    var dataRows = [];

    dataRows.push(keys.join(","));

    for (var i = 0; i < dataLen; ++i) {
        var dataRow = [];
        for (var j = 0; j < keys.length; ++j) {
            var dataVal = this.data[keys[j]][i];
            if (typeof dataVal === "string") {
                dataRow.push(dataVal.replace(",", ""));
            }
            else {
                dataRow.push(dataVal);
            }
        }
        console.log(dataRow);
        dataRow = dataRow.join(",");
        dataRows.push(dataRow);
    }

    dataRows = dataRows.join("\n");

    return dataRows;
};

Schema.fromDeconData = function(deconData) {
    return new Schema(
        deconData.data,
        deconData.attrs,
        deconData.nodeAttrs,
        deconData.ids,
        deconData.mappings
    );
};


restylingApp.factory('Schema', function () {
    return Schema;
});