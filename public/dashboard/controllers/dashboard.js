'use strict';



angular.module('mean.dashboard', [])

        .controller('UploaderCtrl', ['$scope', '$upload', function($scope, $upload) {
                $scope.onFileSelect = function($files) {
                    $scope.selectedFiles = [];
                    $scope.progress = [];
                    if ($scope.upload && $scope.upload.length > 0) {
                        for (var i = 0; i < $scope.upload.length; i++) {
                            if ($scope.upload[i] != null) {
                                $scope.upload[i].abort();
                            }
                        }
                    }
                    $scope.upload = [];
                    $scope.uploadResult = [];
                    $scope.selectedFiles = $files;
                    $scope.dataUrls = [];
                    for (var i = 0; i < $files.length; i++) {
                        var $file = $files[i];
                        if (window.FileReader && $file.type.indexOf('image') > -1) {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL($files[i]);
                            var loadFile = function(fileReader, index) {
                                fileReader.onload = function(e) {
                                    $timeout(function() {
                                        $scope.dataUrls[index] = e.target.result;
                                    });
                                };
                            }(fileReader, i);
                        }
                        $scope.progress[i] = -1;
                        if ($scope.uploadRightAway) {
                            $scope.start(i);
                        }
                    }
                };

                $scope.start = function(index) {
                    $scope.progress[index] = 0;
                    $scope.errorMsg = null;
                    if ($scope.howToSend == 1) {
                        $scope.upload[index] = $upload.upload({
                            url: 'upload',
                            method: $scope.httpMethod,
                            headers: {'my-header': 'my-header-value'},
                            data: {
                                myModel: $scope.myModel
                            },
                            /* formDataAppender: function(fd, key, val) {
                             if (angular.isArray(val)) {
                             angular.forEach(val, function(v) {
                             fd.append(key, v);
                             });
                             } else {
                             fd.append(key, val);
                             }
                             }, */
                            /* transformRequest: [function(val, h) {
                             console.log(val, h('my-header')); return val + '-modified';
                             }], */
                            file: $scope.selectedFiles[index],
                            fileFormDataName: 'myFile'
                        });
                        $scope.upload[index].then(function(response) {
                            $timeout(function() {
                                $scope.uploadResult.push(response.data);
                            });
                        }, function(response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }, function(evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                        });

                        $scope.upload[index].xhr(function(xhr) {

                        });
                    } else {
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            $scope.upload[index] = $upload.http({
                                url: 'upload',
                                headers: {'Content-Type': $scope.selectedFiles[index].type},
                                data: e.target.result
                            }).then(function(response) {
                                $scope.uploadResult.push(response.data);
                            }, function(response) {
                                if (response.status > 0)
                                    $scope.errorMsg = response.status + ': ' + response.data;
                            }, function(evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            });
                        };
                        fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
                    }
                };

                $scope.abort = function(index) {
                    $scope.upload[index].abort();
                    $scope.upload[index] = null;
                };


            }])

        .controller('AuthorizerUserCtrl', ['$scope', '$http', function($scope, $http) {

                $scope.formData = {};

                /* Quando LA pagina viene caricata, tutti gli utenti vengono mostrati
                 Questo viene realizzato attraverso una chiamata http all'api definita
                 in /server/route/users.js
                 Che restitusice un json con tutti gli utenti
                 */

                $http.get('/api/users')
                        .success(function(data) {
                            $scope.users = data;
                            console.log("[DEBUG] Retrive this users " + data);
                        })
                        .error(function(data) {
                            console.log("[ERROR] Failed retrieve all users");
                        });

                $scope.authorizeUser = function() {
                    $http.put('/api/users', $scope.formData)
                            .success(function(data) {
                                $scope.users = data;
                                console.log("[DEBUG] Retrive this users " + data);
                            })
                            .error(function(data) {
                                console.log("[ERROR] Failed to update user:" + data);
                            });
                };

                $scope.dismissUser = function() {
                    $http.put('/api/users', $scope.formData)
                            .success(function(data) {
                                $scope.users = data;
                                console.log("[DEBUG] Retrive this users " + data);
                            })
                            .error(function(data) {
                                console.log("[ERROR] Failed to update  user:" + data);
                            });
                };
            }])

        .controller('FamilyCtrl', ['$scope', '$http', function($scope, $http) {

                $scope.createFamily = function() {
                    $http.post('/api/family', $scope.formData)
                            .success(function(data) {
                                $scope.formData = {};
                                $scope.family = data;
                            })
                            .error(function(data) {
                                console.log('[ERROR] Failed save family: ' + data);
                            });
                };

                $scope.removeFamily = function() {
                    $http.post('/api/family', $scope.formData)
                            .success(function(data) {
                                $scope.formData = {};
                                $scope.family = data;
                            })
                            .error(function(data) {
                                console.log('[ERROR] Failed save family: ' + data);
                            });
                };

            }])

        .controller('ExecuteQueryCtrl', ['$scope', '$http', function($scope, $http) {
                var element;
                $scope.elValue = function(x) {
                    element = x;
                };
                $scope.submit = function() {
                    var keyword = $scope.query.keyword;
                    switch (element) {
                        case 'gene':
                            $http.get('/api/gene/finder/query?gene=' + keyword)
                                    .success(function(data) {
                                        console.log("QUERY SUCCEDED. RECEIVED:" + data);
                                        for (variant in data.payload.variants)
                                            $http.get('/api/variant/' + variant._id, data)
                                                .success($scope.elements.push(data))
                                                .error(console.log('[ERROR] Failed retriveving SNP with ID: ' + keyword));
                                    })
                                    .error(function(data) {
                                        console.log('[ERROR] Failed retriveving SNP with ID: ' + keyword);
                                    });
                            break;
                    }
                };
            }]);

