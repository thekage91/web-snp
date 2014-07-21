/**
 * Created by ugo on 7/21/14.
 */

angular.module('SchemaService', [])
    // super simple service
    // each function returns a promise object
    .factory('Schema', function($http,$q) {
        return {
            retrieveFromSchema: function (data, schema, noModify) {
                var res = {};
                var camelized;
                for (var el in data) {
                    if (!noModify) camelized = camelize(el); else camelized = el;
                    for (var i = 0; i < schema.length; i++)
                        if (camelized === schema[i]) {
                            res[camelized] = data[el];
                            delete data[el];
                        }
                }
                return res;
            },
            inizializeSchemasFromGET : function (args) {

            var schemaContainer = [];
            for (var i = 0; i < args.length; i++) {
                var jsonWithSchema = args[i][0];

                //Get first response's filed with mongoose.Model.attr JSON
                for (var key in jsonWithSchema) if (jsonWithSchema.hasOwnProperty(key))  break;
                var element = key;
                var schema = jsonWithSchema[key];

                //console.info('[INFO] element : ' + element + '\n[INFO] schema : ' + JSON.stringify(schema));

                schemaContainer[element] = schema;
            }
            return schemaContainer;
        }

        }
    })