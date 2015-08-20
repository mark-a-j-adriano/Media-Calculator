(function (angular) {

	'use strict';

	angular
		.module('mf-demo', ['ngRoute', 'ek.mobileFrame', 'oc.lazyLoad'])

		.config(['$routeProvider', function ($routeProvider) {

			$routeProvider
				.when('/', {
					template: [
						'<h1>Welcome</h1>',
						'<p>Bacon ipsum dolor sit amet swine filet mignon tail, pastrami meatloaf ground round tenderloin shoulder chuck brisket beef ribs kielbasa. Andouille drumstick ribeye sausage shankle jerky. Beef pastrami capicola shank venison ribeye frankfurter sausage drumstick spare ribs. Beef pig pork loin beef ribs chicken. Beef ribs tenderloin ham pork turkey ribeye pork loin venison ham hock bacon sausage t-bone meatloaf. Pork belly shank boudin andouille tenderloin, sausage ham biltong pastrami cow salami leberkas.</p>',
						'<p>Jerky meatball ham hock ham corned beef swine beef salami spare ribs pork andouille beef ribs cow. Pork tenderloin jerky strip steak jowl doner shoulder drumstick ribeye tri-tip beef ribs leberkas spare ribs cow andouille. T-bone shankle brisket tongue beef ball tip flank pork loin corned beef. Venison beef ribs sirloin salami, swine bacon t-bone bresaola boudin corned beef pastrami.</p>',
						'<p>Short loin short ribs corned beef ball tip drumstick swine frankfurter pork loin. Sirloin shank prosciutto ham, pork chop leberkas ribeye swine jerky brisket beef tail tongue. Pork belly pancetta meatloaf hamburger pork loin jowl leberkas ham hock. Ball tip pancetta pork chop turkey. Chuck swine rump, venison prosciutto ham hock leberkas pancetta bresaola meatloaf doner filet mignon pork loin ham short loin. Beef boudin jowl ball tip.</p>',
						'<p>Tri-tip ham capicola spare ribs. Pork andouille pork chop, ham hock chuck bresaola venison beef flank hamburger shoulder meatloaf. Flank tongue frankfurter tri-tip pork turkey ribeye salami bacon prosciutto hamburger venison. Venison chicken shank fatback cow ham ham hock spare ribs tongue brisket pork belly tenderloin.</p>'
					].join('')
				})
				.when('/about/', {
					template: [
						'<h1>About</h1>',
						'<p>The About page &hellip;</p>'
					].join('')
				})
				.when('/contact/', {
					template: [
						'<h1>Contact</h1>',
						'<p>The Contact page &hellip;</p>'
					].join('')
				})
				.when('/search/:search', {
					template: [
						'<h1>Search Results</h1>',
						'<ol class="search-results">',
						'	<li ng-repeat="result in results">',
						'		<h2>{{result.title}}</h2>',
						'		<p>{{result.description}}</p>',
						'	</li>',
						'</ol>'
					].join(''),
					controller: 'SearchResultCtrl'
				})
				.otherwise({
					redirectTo: '/'
				});

		}])

		.controller('SearchFormCtrl', ['$scope', '$location', function ($scope, $location) {
			$scope.onSearch = function () {
				$location.url('/search/' + $scope.search);
			};
		}])

		.controller('SearchResultCtrl', ['$scope', function ($scope) {
			$scope.results = [{
				title: 'Lorem ipsum',
				description: 'Short loin short ribs corned beef ball …'
			}, {
				title: 'Lorem ipsum',
				description: 'Short loin short ribs corned beef ball …'
			}, {
				title: 'Lorem ipsum',
				description: 'Short loin short ribs corned beef ball …'
			}, {
				title: 'Lorem ipsum',
				description: 'Short loin short ribs corned beef ball …'
			}];
		}])

		.directive('blurOnSubmit', function () {
			return {
				restrict: 'A',
				link: function ($scope, $elem) {
					$elem.on('keyup', function (evnt) {
						if ( evnt.keyCode !== 13 ) {
							return;
						}
						this.blur();
					});
				}
			}
		});

})(angular);