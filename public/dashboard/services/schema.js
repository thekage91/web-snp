/**
 * Created by ugo on 7/21/14.
 */

angular.module('SchemaService', [])
    // super simple service
    // each function returns a promise object
    .factory('Schema', function ($http, $q) {

        function filterAndReturnPathogenicity(data, pathogenicitySchema) {
            var path = filterAndReturn(data, pathogenicitySchema);
            path.GERpp = data['GERP++'];
            path.SIFT = data['SIFT'];
            path.polyPhen = data['PolyPhen-2'];
            return path;
        };

        function filterAndReturn (data, schema, noModify) {

            var count = 0,res = {},camelized,found;

          /*  for (var el in data) {
                found = false;


                for (var i = 0; i <= schema.length; i++)
                    if (camelized === schema[i]) {
                        count++;
                        found = true;
                        res[camelized] = data[el];
                        delete data[el];
                    }
                //If the schema's element is not found
                if(!found) res[camelized] = '.';
            }*/

            schema.forEach( function (schemaEl) {
                found = false;
                for (var dataEl in data) {
                    if (!noModify) camelized = camelize(dataEl); else camelized = dataEl;
                    //console.log('data element camelized : ' + camelized);
                    if (camelized === schemaEl) {
                        found = true;
                        res[camelized] = data[dataEl];
                        delete data[dataEl];
                    }
                }
                if(!found) res[schemaEl] = '.';
            });
           /* console.log('risultato con schema ' + schema+ 'e con data');
            console.info(data);
            console.log(res);*/

            /*if ( (count !== schema.length)
                && (!( (count+3 === schema.length ) && ( schema.length === 7) ))
                ) {
                console.warn("WARNING: got: " +count+" of "+schema.length+" elements of "+ schema + " list: ")
                console.warn(data);
            }*/
            return res;
        };


        camelize = function (x) {
            var temp = x.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
            return temp.replace(/[^\w\s]/gi, '');
        };

        camelizeold = function (x) {
            return x.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
                if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        };

        return {
            retrieveFromSchema: function (data, schema) {
                if(schema.indexOf('SIFT') > -1)
                    return filterAndReturnPathogenicity (data, schema);
                else if (schema.indexOf('ESP6500_ALL') > -1)
                    return filterAndReturn(data, schema,true);
                else
                    return filterAndReturn(data, schema);
            }



            ,
            inizializeSchemasFromGET: function (args) {


                var schemaContainer = [];
                for (var i = 0; i < args.length; i++) {
                    var jsonWithSchema = args[i].data;

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