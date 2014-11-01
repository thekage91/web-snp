'use strict';


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

angular.module('mean.dashboard', ['angular-md5'])

    .controller('UploaderCtrl', ['$scope', '$window', '$http', 'Model', 'Parse', 'Save', 'Filter', '$q', '$timeout',
        function ($scope, $window, $http, Model, Parse, Save, Filter, $q, $timeout) {


            var name;

            $scope.saveResult = function () {
                name = $scope.patient;
                console.log("Patient name = " + name);
                $scope.jsonUpload = JSON.parse($window.output);
                console.log($scope.jsonUpload);
                for (var key in $scope.jsonUpload) if ($scope.jsonUpload.hasOwnProperty(key))  break;

                Filter.updateDistinctValues($scope.jsonUpload[key], ['Mutation', 'region']);
                //console.log( Filter.getDistinctValues('Genotype') + '\ntype = ' + typeof Filter.getDistinctValues('region') + '\n' + Filter.getDistinctValues('region'));

                var saveFunction = (Parse.saveInDbFromData);
                saveFunction($scope.jsonUpload, name);

            };


        }])


    .controller('AuthorizerUserCtrl', ['$scope' , '$http' , 'md5', function ($scope, $http, md5) {

        $scope.formData = {};

        /* Quando la pagina viene caricata, tutti gli utenti vengono mostrati
         Questo viene realizzato attraverso una chiamata http all'api definita
         in /server/route/users.js
         Che restitusice un json con tutti gli utenti
         */

        $http.get('/api/user')
            .success(function (data) {
                $scope.users = data.payload;
                console.log("[DEBUG] Retrive this users " + data.payload);

                $scope.users.forEach(function (user) {
                    user.emailHash = md5.createHash(user.email);
                });
            })
            .error(function (data) {
                console.log("[ERROR] Failed retrieve all users");
            });


        $scope.authorizeUser = function (user) {
            console.log(user);

            $scope.usernameError = null;
            $scope.registerError = null;

            $http.post('/register', user)
                .success(function (data) {
                    angular.element('#formInsert').collapse('hide');
                    $scope.user = {};
                    // authentication OK
                    $scope.users.push(user);
                    $scope.registerError = 0;
                })
                .error(function (error) {
                    // Error: authentication failed
                    if (error === 'Username already taken') {
                        $scope.usernameError = error;
                    } else {
                        $scope.registerError = error;
                    }
                });

            location.reload();
        };


        $scope.cancelUser = function (user) {
            console.log(user._id)
            $http.delete('/api/user/' + user._id)
                .success(function (data) {
                    var index = $scope.users.indexOf(user);
                    $scope.users.splice(index, 1);
                    console.log("[DEBUG] Remove this users " + user._id);
                })
                .error(function (data) {
                    console.log("[ERROR] Failed to update  user:" + user._id);
                });
        };

        $scope.cancelOperation = function () {
            angular.element('#formInsert').collapse('hide');
            $scope.user = {};
        };

        $scope.promote2Admin = function (user) {
            var roles = user.roles;
            roles.push('admin');
            $http.post('/api/user/' + user._id, {roles: roles})
                .success(function (data) {
                    var index = $scope.users.indexOf(user);
                    $scope.users[index].roles.push('admin');
                    console.log("[DEBUG] Promote to admin this users " + user._id);
                })
                .error(function (data) {
                    console.log("[ERROR] Error for Promote to admin this users " + user._id);
                });
        }

        $scope.degrade2licensed = function (user) {
            var roles = ['authenticated' , 'licensed'];
            $http.post('/api/user/' + user._id, {roles: roles})
                .success(function (data) {
                    var index = $scope.users.indexOf(user);
                    $scope.users[index].roles = roles;
                    console.log("[DEBUG] Degrade to licensed this users " + user._id);
                })
                .error(function (data) {
                    console.log("[ERROR] Error for degrade to licensed this users " + user._id);
                });
        }

    }])

    .controller('FamilyCtrl', ['$scope', '$http', function ($scope, $http) {

        //$scope.inPatients = [{name: "provaIN1"} , {name: "provaIN2"} , {name: "provaIN3"}]
        //$scope.outPatients = [{name: "provaOUT1"} , {name: "provaOUT2"} , {name: "provaOUT3"}]

        $http.get('/api/family')
            .success(function (data) {
                $scope.families = data.payload;
                console.log("[DEBUG] Retrive this families " + data);
            })
            .error(function (data) {
                console.log("[ERROR] Failed retrieve all users");
            });

        $scope.createFamily = function (family) {

            $http.post('/api/family', family)
                .success(function (data) {
                    $scope.formData = {};
                    $scope.families.push(data.payload);
                    $scope.family = {};
                    angular.element('#formInsert').collapse('hide');
                    console.log("[SUCCESS] Write this data on DB: " + data)
                })
                .error(function (data) {
                    console.log("[ERROR] Failed save family: " + data);
                });
        }

        $scope.removeFamily = function (item) {
            var idSelected = $scope.families.indexOf(item);
            console.log("[DEBUG] I should remove family with id " + item._id);

            $http.delete('/api/family/' + item._id)
                .success(function (data) {
                    $scope.formData = {};
                    $scope.families.splice(idSelected, 1);
                    console.log("[SUCCESS] Remove family with id " + item._id);
                })
                .error(function (data) {
                    console.log('[ERROR] Failed remove family: ' + data);
                });
        }

        $scope.cancel = function () {
            $scope.family = {};
            angular.element('#formInsert').collapse('hide');
        }

        $scope.show = false;
        $scope.showConfirmation = function (setShow) {
            return $scope.show = setShow;
        }

        $scope.updateFamily = function (item, familyUp) {
            $scope.showConfirmation(false);
            var idSelected = $scope.families.indexOf(item);

            $http.post('/api/family/' + item._id, familyUp)
                .success(function (data) {
                    $scope.family_edit = {};
                    console.log(JSON.stringify(familyUp));
                    //$scope.families[idSelected].name = familyUp;
                    console.log('[SUCCESS] Update name of family with id ' + item._id);
                })
                .error(function (data) {
                    console.log('[ERROR] Failed update family with id ' + item._id);
                });
        }

        $scope.contains = function (array, item) {
            if (array === undefined) {
                return false;
            }

            return array.indexOf(item) > -1;
        }

        $scope.showPatients = function (family) {

            if (family.patients === undefined) {
                family.patients = [];
            }

            $scope.inPatients = family.patients;
            $scope.familySelected = family;

            $http.get('/api/patient')
                .success(function (data) {
                    var allPatients = data.payload;
                    $scope.outPatients = allPatients.filter(function (item) {
                        return !($scope.contains($scope.inPatients, item._id));
                    });
                    $scope.inPatients = allPatients.filter(function (item) {
                        return !($scope.contains($scope.outPatients, item));
                    });

                    console.log("out")
                    console.log($scope.outPatients);
                    console.log("in")
                    console.log($scope.inPatients);

                })
                .error(function (err) {
                    console.log("[ERROR] Failed retrieve all patients -->" + err);
                });
        }

        $scope.removePatient = function (patient) {
            var idFamily = $scope.familySelected._id;
            var newPatients = $scope.inPatients;

            newPatients.splice(newPatients.indexOf(patient), 1);
            console.log(newPatients);
            var jsonToSend = {'patients': newPatients};

            $http.post('/api/family/' + idFamily, jsonToSend)
                .success(function (data) {
                    $scope.inPatients = newPatients;
                    $scope.outPatients.push(patient);
                    console.log("[SUCCESS] Remove patient " + patient._id + " from family " + idFamily);
                })
                .error(function (err) {
                    console.log("[ERROR] Failed remove patient " + patient._id + " from family " + idFamily);
                });
        }

        $scope.addPatient = function (patient) {
            var idFamily = $scope.familySelected._id;
            var newPatients = [];

            $scope.inPatients.forEach(function (item) {
                newPatients.push(item._id);
            })

            newPatients.push(patient._id);

            var jsonToSend = {'patients': newPatients};

            $http.post('/api/family/' + idFamily, jsonToSend)
                .success(function (data) {
                    $scope.inPatients.push(patient);
                    $scope.outPatients.splice($scope.outPatients.indexOf(patient), 1);
                    console.log("[SUCCESS] Add patient " + patient._id + " in family " + idFamily);
                })
                .error(function (err) {
                    console.log("[ERROR] Failed add patient " + patient._id + " in family " + idFamily);
                });
        }

        $scope.showEdit = false;
        $scope.showEditFamilies = function (showEditFamily) {
            return $scope.showEdit = showEditFamily;
        }

        $scope.finishedOperation = function () {
            $scope.showEditFamilies(false);
            angular.element('#patientsPanel').collapse('hide');
        }

    }])


    .controller('ExecuteQueryCtrl', ['$scope', '$http','$timeout','Filter', 'Query', function ($scope, $http,$timeout, Filter, Query) {

        $scope.filtro = {};
        $scope.isChecked = {};
        $scope.isChecked.all = true;
        $scope.resultsFilter = {};

        $scope.nameMap = { genes: 'Genes', freqAlt: 'Freq Alt',dbSNP:'dbSNP',init: 'Search By...'};
        var filterElements = ['region', 'Mutation'];

        //init filters values for checkobox and showing result
        (function () {
            filterElements.forEach(function (element) {
                Filter.getDistinctValues(element).then(function (data) {
                    $scope.filtro[element] = data;
                    console.log("Got filter elements");
                });
                $scope.resultsFilter[element] = [];
            })
        })();

        $scope.submitBase = function () {
            $scope.query.ok = true;

            var keyword = $scope.query.keyword;
            var element = $scope.query.element;
            $scope.elements = [];


             Query.submitQueryByElement(element, keyword).then(function (data) {
                $scope.elements = data;
            });


        };


        $scope.submitByRegion = function () {
            $scope.query.ok = true;

            var chr = $scope.query.chr;
            var start = $scope.query.start;
            var end = $scope.query.end;

            $scope.elements = [];

           Query.submitByRegion(chr, start, end).then(function (data) {
               $scope.elements = data;
            });

        }


        $scope.updateResultFilter = function (word, field) {
            var fieldArrayWithWords = $scope.resultsFilter[field];

            if(word !== 'all') $scope.isChecked.all = false;
            if (!($scope.isChecked[word]))
                fieldArrayWithWords.push(word);
            else {
                var index = $scope.resultsFilter[field].indexOf(word);
                if (index > -1)
                    fieldArrayWithWords.splice(index, 1);
            }
        }

        $scope.filterNotExclusive = function (item) {

            if ($scope.isChecked.all) return true;
            var conditions = [];

            filterElements.forEach( function (element) {
                var fieldArrayWithWords = $scope.resultsFilter[element];

                if((fieldArrayWithWords.indexOf(item[element]) > -1) ||
                   (fieldArrayWithWords.indexOf(item[element.toLowerCase()]) > -1) ||
                   (fieldArrayWithWords.length < 1))
                conditions.push(true);
                else
                conditions.push(false);
            });

            return conditions.reduce( function(prev, cur) { return prev && cur });
        }

        $scope.addQueryBox = function (conditionType) {
            $scope.queries.push( { cond: conditionType});
        }

    }])

    .controller('InputQuery')
    .controller('SequencingEditCtrl', ['$scope', '$http', 'Parse', 'Save', function ($scope, $http, Parse, Save) {

        $scope.parseForEdit = function (dataParse) {

            dataParse.forEach(function (json) {

                json['Genotype_quality'] = json['Genotype quality'];
                delete json['Genotype quality'];

                json['Reads_deeph'] = json['Reads deeph'];
                delete json['Reads deeph'];

                json['Ref_Alt_filtered_reads'] = json['Ref,Alt filtered reads'];
                delete json['Ref,Alt filtered reads'];

                json['Genotypes_likelihood'] = json['Genotypes likelihood'];
                delete json['Genotypes likelihood'];

                json['Haplotype_score'] = json['Haplotype score'];
                delete json['Haplotype score'];

                json['Strand_bias'] = json['Strand bias'];
                delete json['Strand bias'];

                json['Freq_ref'] = json['Freq ref'];
                delete json['Freq ref'];

                json['Freq_alt'] = json['Freq alt'];
                delete json['Freq alt'];
            });

            return dataParse;
        }

        $scope.parseAfterEdit = function (dataParse) {

            dataParse.forEach(function (json) {

                json['Genotype quality'] = json['Genotype_quality'];
                delete json['Genotype_quality'];

                json['Reads deeph'] = json['Reads_deeph'];
                delete json['Reads_deeph'];

                json['Ref,Alt filtered reads'] = json['Ref_Alt_filtered_reads'];
                delete json['Ref_Alt_filtered_reads'];

                json['Genotypes likelihood'] = json['Genotypes_likelihood'];
                delete json['Genotypes_likelihood'];

                json['Haplotype score'] = json['Haplotype_score'];
                delete json['Haplotype_score'];

                json['Strand bias'] = json['Strand_bias'];
                delete json['Strand_bias'];

                json['Freq ref'] = json['Freq_ref'];
                delete json['Freq_ref'];

                json['Freq alt'] = json['Freq_alt'];
                delete json['Freq_alt'];
            });

            return dataParse;
        }

        //$scope.myData = [{name: "Moroni", age: 50}, {name: "Moroni", age: 50}]
        $scope.myData = [
            {
                "chr": "chr1",
                "start": "100152443",
                "end": "100152443",
                "ref": "T",
                "alt": "C",
                "qual": "580.35",
                "filter": "PASS",
                "Genotype": "het",
                "Genotype quality": "50",
                "Reads deeph": "4 on 38",
                "Ref,Alt filtered reads": "2,2",
                "Genotypes likelihood": "66,0,50",
                "Haplotype score": "1.3597",
                "Strand bias": ".",
                "dbSNP": "rs1338576",
                "Freq ref": "0.5312",
                "Freq alt": "0.4688",
                "region": "intronic",
                "genes": "PALMD",
                "Mutation": ".",
                "Annotation": ".",
                "SIFT": ".",
                "PolyPhen-2": ".",
                "MutationTaster": ".",
                "MutationAssessor": ".",
                "GERP++": ".",
                "PhyloP": ".",
                "SiPhy": ".",
                "ESP6500_ALL": "0.507763",
                "ESP6500_AA": "0.379501",
                "ESP6500_EA": "0.572749"
            },
            {
                "chr": "chr1",
                "start": "100316589",
                "end": "100316589",
                "ref": "A",
                "alt": "G",
                "qual": "590.84",
                "filter": "PASS",
                "Genotype": "homo_ref",
                "Genotype quality": "9",
                "Reads deeph": "3 on 37",
                "Ref,Alt filtered reads": "3,0",
                "Genotypes likelihood": "0,9,114",
                "Haplotype score": "0.333",
                "Strand bias": ".",
                "dbSNP": "rs2307130",
                "Freq ref": "0.5702",
                "Freq alt": "0.4298",
                "region": "splicing",
                "genes": "AGL",
                "Mutation": ".",
                "Annotation": ".",
                "SIFT": ".",
                "PolyPhen-2": ".",
                "MutationTaster": ".",
                "MutationAssessor": ".",
                "GERP++": ".",
                "PhyloP": ".",
                "SiPhy": ".",
                "ESP6500_ALL": "0.415731",
                "ESP6500_AA": "0.277349",
                "ESP6500_EA": "0.486628"
            },
            {
                "chr": "chr1",
                "start": "100340225",
                "end": "100340225",
                "ref": "G",
                "alt": "A",
                "qual": "258.75",
                "filter": "PASS",
                "Genotype": "homo_alt",
                "Genotype quality": "6",
                "Reads deeph": "2 on 14",
                "Ref,Alt filtered reads": "0,2",
                "Genotypes likelihood": "75,6,0",
                "Haplotype score": "0.7472",
                "Strand bias": ".",
                "dbSNP": "rs634880",
                "Freq ref": "0.2723",
                "Freq alt": "0.7277",
                "region": "intronic",
                "genes": "AGL",
                "Mutation": ".",
                "Annotation": ".",
                "SIFT": ".",
                "PolyPhen-2": ".",
                "MutationTaster": ".",
                "MutationAssessor": ".",
                "GERP++": ".",
                "PhyloP": ".",
                "SiPhy": ".",
                "ESP6500_ALL": "0.748308",
                "ESP6500_AA": "0.836813",
                "ESP6500_EA": "0.702954"
            },
            {
                "chr": "chr1",
                "start": "100343153",
                "end": "100343153",
                "ref": "A",
                "alt": "G",
                "qual": "46.9",
                "filter": "PASS",
                "Genotype": "homo_alt",
                "Genotype quality": "6",
                "Reads deeph": "2 on 3",
                "Ref,Alt filtered reads": "0,2",
                "Genotypes likelihood": "74,6,0",
                "Haplotype score": "0",
                "Strand bias": ".",
                "dbSNP": "rs2291638",
                "Freq ref": "0.6873",
                "Freq alt": "0.3127",
                "region": "intronic",
                "genes": "AGL",
                "Mutation": ".",
                "Annotation": ".",
                "SIFT": ".",
                "PolyPhen-2": ".",
                "MutationTaster": ".",
                "MutationAssessor": ".",
                "GERP++": ".",
                "PhyloP": ".",
                "SiPhy": ".",
                "ESP6500_ALL": "0.28288",
                "ESP6500_AA": "0.103041",
                "ESP6500_EA": "0.375058"
            },
            {
                "chr": "chr1",
                "start": "100346741",
                "end": "100346741",
                "ref": "T",
                "alt": "C",
                "qual": "598.2",
                "filter": "PASS",
                "Genotype": "het",
                "Genotype quality": "58",
                "Reads deeph": "7 on 39",
                "Ref,Alt filtered reads": "5,2",
                "Genotypes likelihood": "58,0,166",
                "Haplotype score": "0",
                "Strand bias": ".",
                "dbSNP": "rs3736296",
                "Freq ref": "0.4394",
                "Freq alt": "0.5606",
                "region": "intronic",
                "genes": "AGL",
                "Mutation": ".",
                "Annotation": ".",
                "SIFT": ".",
                "PolyPhen-2": ".",
                "MutationTaster": ".",
                "MutationAssessor": ".",
                "GERP++": ".",
                "PhyloP": ".",
                "SiPhy": ".",
                "ESP6500_ALL": "0.504152",
                "ESP6500_AA": "0.437585",
                "ESP6500_EA": "0.538256"
            },
            {
                "chr": "chr1",
                "start": "100353675",
                "end": "100353675",
                "ref": "G",
                "alt": "A",
                "qual": "826.34",
                "filter": "PASS",
                "Genotype": "het",
                "Genotype quality": "45",
                "Reads deeph": "10 on 63",
                "Ref,Alt filtered reads": "8,2",
                "Genotypes likelihood": "45,0,282",
                "Haplotype score": "0.1664",
                "Strand bias": ".",
                "dbSNP": "rs555929",
                "Freq ref": "0.3191",
                "Freq alt": "0.6809",
                "region": "intronic",
                "genes": "AGL",
                "Mutation": ".",
                "Annotation": ".",
                "SIFT": ".",
                "PolyPhen-2": ".",
                "MutationTaster": ".",
                "MutationAssessor": ".",
                "GERP++": ".",
                "PhyloP": ".",
                "SiPhy": ".",
                "ESP6500_ALL": "0.654852",
                "ESP6500_AA": "0.596686",
                "ESP6500_EA": "0.684651"
            }
        ];


        $scope.parseForEdit($scope.myData);

        $scope.gridOptions = {
            data: 'myData',
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEdit: true,
            columnDefs: [
                {field: 'chr', width: 120, displayName: 'chr', enableCellEdit: true},
                {field: 'start', width: 120, displayName: 'start', enableCellEdit: true},
                {field: 'end', width: 120, displayName: 'end', enableCellEdit: true},
                {field: 'ref', width: 120, displayName: 'ref', enableCellEdit: true},
                {field: 'alt', width: 120, displayName: 'alt', enableCellEdit: true},
                {field: 'qual', width: 120, displayName: 'qual', enableCellEdit: true},
                {field: 'filter', width: 120, displayName: 'filter', enableCellEdit: true},
                {field: 'Genotype', width: 120, displayName: 'Genotype', enableCellEdit: true},
                {field: 'Genotype_quality', width: 120, displayName: 'Genotype quality', enableCellEdit: true},
                {field: 'Reads_deeph', width: 120, displayName: 'Reads deeph', enableCellEdit: true},
                {field: 'Ref_Alt_filtered_reads', width: 120, displayName: 'Ref,Alt filtered reads', enableCellEdit: true},
                {field: 'Genotypes_likelihood', width: 120, displayName: 'Genotypes likelihood', enableCellEdit: true},
                {field: 'Haplotype_score', width: 120, displayName: 'Haplotype score', enableCellEdit: true},
                {field: 'Strand_bias', width: 120, displayName: 'Strand bias', enableCellEdit: true},
                {field: 'dbSNP', width: 120, displayName: 'dbSNP', enableCellEdit: true},
                {field: 'Freq_ref', width: 120, displayName: 'Freq ref', enableCellEdit: true},
                {field: 'region', width: 120, displayName: 'region', enableCellEdit: true},
                {field: 'genes', width: 120, displayName: 'genes', enableCellEdit: true},
                {field: 'Mutation', width: 120, displayName: 'Mutation', enableCellEdit: true},
                {field: 'Annotation', width: 120, displayName: 'Annotation', enableCellEdit: true},
                {field: 'SIFT', width: 120, displayName: 'SIFT', enableCellEdit: true},
                {field: 'PolyPhen-2', width: 120, displayName: 'PolyPhen-2', enableCellEdit: true},
                {field: 'MutationTaster', width: 120, displayName: 'MutationTaster', enableCellEdit: true},
                {field: 'MutationAssessor', width: 120, displayName: 'MutationAssessor', enableCellEdit: true},
                {field: 'GERP', width: 120, displayName: 'GERP++', enableCellEdit: true},
                {field: 'PhyloP', width: 120, displayName: 'PhyloP', enableCellEdit: true},
                {field: 'SiPhy', width: 120, displayName: 'SiPhy', enableCellEdit: true},
                {field: 'ESP6500_ALL', width: 120, displayName: 'ESP6500_ALL', enableCellEdit: true},
                {field: 'ESP6500_AA', width: 120, displayName: 'ESP6500_AA', enableCellEdit: true},
                {field: 'ESP6500_EA', width: 120, displayName: 'ESP6500_EA', enableCellEdit: true}
            ]
        };

        $scope.saveOnDB = function () {

            $scope.parseAfterEdit($scope.myData);
            name = $scope.patient
            console.log("Patient name = " + name)

            var saveFunction = (Parse.saveInDbFromData);
            saveFunction($scope.myData, name);
        }

    }])


    .controller('HistoryLoadCtrl' ['$scope' , '$http' , function ($scope, $http) {

        $http.get('/api/history')
            .success(function (data) {
                $scope.sequencings = data.payload;
                console.log("[SUCCESS] Retrieve all sequencings");
            })
            .error(function (err) {
                console.log("[ERROR] Failed Retrieve all sequencings");
            });

        $scope.removeSequencing = function (sequencing) {

            for (item in $scope.sequencings) {
                var idsToRemove = item.item;
                for (itemDelete in idsToRemove) {
                    for (idRemove in itemDelete.id) {
                        $http.delete('/api/' + itemDelete.table + "/" + idRemove)
                            .success(function (data) {
                            })
                            .error(function (err) {
                            });
                    }
                }
            }
        }
    }])


    .controller('ProfileCtrl', ['$scope' , 'md5', '$http' , function ($scope, md5, $http) {

        $scope.emailHash = md5.createHash($scope.global.user._id)

        console.log($scope.emailHash);

        $http.get('/api/user/' + $scope.global.user._id)
            .success(function (data) {
                $scope._user = data.payload;
                console.log("[SUCCESS] Retrive user " + $scope._user._id + " from database");
            })
            .error(function (err) {
                console.log("[ERROR] Failed Retrive user " + $scope._user._id + " from database");
            });

        $scope.updateProfile = function (user) {

            $http.post('/api/user/' + $scope.global.user._id, user)
                .success(function (data) {
                    console.log("[SUCCESS] Upload info of this user " + $scope.user._id);
                })
                .error(function (data) {
                    console.log("[ERROR] Error in upload info of this user " + $scope.user._id);
                });

        };

        $scope.cancelOperation = function () {
            $scope.user = {};
        }

    }])

    .controller('PatientsCtrl', ['$scope' , '$http' , function ($scope, $http) {

    }])

    .directive('gravatar', function () {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                name: '@',
                height: '@',
                width: '@',
                emailHash: '@'
            },
            link: function (scope, el, attr) {
                scope.defaultImage = 'https://www.mechanicpool.com/pictures/greypros.png';
            },
            template: '<img alt="{{ name }}" height="{{ height }}"  width="{{ width }}" src="https://secure.gravatar.com/avatar/{{ emailHash }}.jpg?s={{ width }}&d={{ defaultImage }}">'
        };
    })



