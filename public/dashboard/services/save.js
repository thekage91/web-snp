//Created by ugo on 7/21/14.


angular.module('SaveService', [])
    .factory('Save', function ($http, $rootScope, Model, Schema) {
        return {

            saveClassFromList: function (singleAttList, schemaName, schemaAttributes) {

                var associatedAttributes = (Schema.retrieveFromSchema)(singleAttList, schemaAttributes);
                return (Model.create)(schemaName, associatedAttributes);
            }

        }
    })
;
