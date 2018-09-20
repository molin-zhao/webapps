'use strict';
angular.module('mockgramApp', ['ui.router', 'ngResource']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        // route for the home page
        .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'components/header.html',
                    controller: 'NavbarController'
                },
                'content': {
                    templateUrl: 'components/home.html',
                },
                'footer': {
                    templateUrl: 'components/footer.html',
                }
            }
        })
        // route for the api page
        .state('app.api', {
            url: 'api',
            views: {
                'content@': {
                    templateUrl: 'components/api.html'
                }
            }
        })
        // route for the download page
        .state('app.download', {
            url: 'download',
            views: {
                'content@': {
                    templateUrl: 'components/download.html'
                }
            }
        });
    $urlRouterProvider.otherwise('/');
});