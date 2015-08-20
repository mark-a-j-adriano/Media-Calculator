'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['ui.router', 'oc.lazyLoad','ngAnimate']);

app.config(
    function($stateProvider, $locationProvider, $urlRouterProvider, $ocLazyLoadProvider){
        $urlRouterProvider.otherwise("/");
        $locationProvider.hashPrefix('!');
   
        // You can also load via resolve
        $stateProvider
            .state('home', {
                url: "/home",
                views: {
                    "lazyLoadView": {
                        controller: 'dataTablesCtrl', // This view will use AppCtrl loaded below in the resolve
                        templateUrl: 'partials/home.html'
                    }
                },
                
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load(
                            [                                
                                'lib/mobileAngularUI/css/mobile-angular-ui-base.min.css',
                                'lib/mobileAngularUI/css/mobile-angular-ui-desktop.min.css',
                                'lib/mobileAngularUI/js/mobile-angular-ui.min.js',
                                'lib/formatter/ngmodel.format.js',
                                'src/app/connector.js',
                                'src/app/services.js',
                                'src/app/index.js',
                                
                            ]
                        );
                    }]
                }
                
            })
            .state('index', {
                url: "/", // root route
                views: {
                    "lazyLoadView": {
                        //controller: 'AppCtrl', // This view will use AppCtrl loaded below in the resolve
                        templateUrl: 'partials/home2.html'
                    }
                },
               
            })
            .state('admin', {
                url: "/admin", // root route
                views: {
                    "lazyLoadView": {                        
                        templateUrl: 'partials/admin.html'
                    }
                }               
            })
            .state('about', {
                url: "/about", // root route
                views: {
                    "lazyLoadView": {
                        templateUrl: 'partials/about.html'
                    }                
                }
            })
            .state('contact', {
                url: "/contact", // root route
                views: {
                    "lazyLoadView": {                    
                        templateUrl: 'partials/contact.html'
                    }
                }
            })
            .state('faq', {
                url: "/faq", // root route
                views: {
                    "lazyLoadView": {
                        //controller: 'AppCtrl', // This view will use AppCtrl loaded below in the resolve
                        templateUrl: 'partials/faq.html'
                    }
                }
            })
            .state('target', {
                url: "/target",
                views: {
                    "lazyLoadView": {
                        controller: 'listTargetDataCtrl', // This view will use AppCtrl loaded below in the resolve
                        templateUrl: 'partials/target-data.html'
                    }
                },
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([
                            'src/app/target.js',
                            'src/app/connector.js'    
                        ]);
                    }]
                }
            })
            .state('nielsen', {
                url: "/nielsen",
                views: {
                    "lazyLoadView": {
                        controller: 'listNielsenDataCtrl', // This view will use AppCtrl loaded below in the resolve
                        templateUrl: 'partials/nielsen-data.html'
                    }   
                },
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([
                            'src/app/nielsen.js',
                            'src/app/connector.js'    
                        ]);
                    }]
                }
            })
            .state('modal', {
                parent: 'index',
                resolve: { // Any property in resolve should return a promise and is executed before the view is loaded
                    loadOcModal: ['$ocLazyLoad', '$injector', '$rootScope', function($ocLazyLoad, $injector, $rootScope) {
                        // Load 'oc.modal' defined in the config of the provider $ocLazyLoadProvider
                        console.log('load');

                        return $ocLazyLoad.load([
                            'css/bootStrap/bootstrap.css', // will use the cached version if you already loaded bootstrap with the button
                            'lib/ocModal/css/ocModal.animations.css',
                            'lib/ocModal/css/ocModal.light.css',
                            'lib/ocModal/ocModal.js',
                            'partials/modal.html'
                        ]).then(function() {

                            console.log('--------then');
                            $rootScope.bootstrapLoaded = true;
                            // inject the lazy loaded service
                            var $ocModal = $injector.get("$ocModal");
                            console.log($ocModal);

                            $ocModal.open({
                               url: 'modal',
                               cls: 'fade-in'  
                            });

                        });
                    }],

                    // resolve the sibling state and use the service lazy loaded
                    setModalBtn: ['loadOcModal', '$rootScope', '$ocModal', function(loadOcModal, $rootScope, $ocModal) {
                        $rootScope.openModal = function() {

                            $ocModal.open({
                                url: 'modal',
                                cls: 'flip-vertical'
                            });
                        }
                    }]
                }
            });

        // Without server side support html5 must be disabled.
        $locationProvider.html5Mode(false);

        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            //debug: true,
            //events: true,
            modules: [{
                name: 'gridModule',
                files: [
                    'app/gridModule.js'
                ]
            }]
        });
    }
);



app.run(['$rootScope', '$state', '$stateParams',
    function($rootScope,   $state,   $stateParams) {
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
]);


app.controller('MainController', function($rootScope, $scope){

  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };

  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;
  
  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function(){
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function(){
    $rootScope.loading = false;
  });

  // 
  // 'Scroll' screen
  // 
  var scrollItems = [];

  for (var i=1; i<=100; i++) {
    scrollItems.push('Item ' + i);
  }

  $scope.scrollItems = scrollItems;

  $scope.bottomReached = function() {
    /* global alert: false; */
    alert('Congrats you scrolled to the end of the list!');
  };

  // 
  // Right Sidebar
  // 
  $scope.chatUsers = [
    { name: 'Carlos  Flowers', online: true },
    { name: 'Byron Taylor', online: true },  
    { name: 'Jana  Terry', online: true },
    { name: 'Darryl  Stone', online: true },
    { name: 'Fannie  Carlson', online: true },
    { name: 'Holly Nguyen', online: true },
    { name: 'Bill  Chavez', online: true },
    { name: 'Veronica  Maxwell', online: true },
    { name: 'Jessica Webster', online: true },
    { name: 'Jackie  Barton', online: true },
    { name: 'Crystal Drake', online: false },
    { name: 'Milton  Dean', online: false },
    { name: 'Joann Johnston', online: false },
    { name: 'Cora  Vaughn', online: false },
    { name: 'Nina  Briggs', online: false },
    { name: 'Casey Turner', online: false },
    { name: 'Jimmie  Wilson', online: false },
    { name: 'Nathaniel Steele', online: false },
    { name: 'Aubrey  Cole', online: false },
    { name: 'Donnie  Summers', online: false },
    { name: 'Kate  Myers', online: false },
    { name: 'Priscilla Hawkins', online: false },
    { name: 'Joe Barker', online: false },
    { name: 'Lee Norman', online: false },
    { name: 'Ebony Rice', online: false }
  ];

  //
  // 'Forms' screen
  //  
  $scope.rememberMe = true;
  $scope.email = 'me@example.com';
  
  $scope.login = function() {
    alert('You submitted the login form');
  };

  // 
  // 'Drag' screen
  // 
  $scope.notices = [];
});