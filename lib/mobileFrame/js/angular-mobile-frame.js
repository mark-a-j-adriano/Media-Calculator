(function (angular, undefined) {

	/**
	 * Property-reference for better minification.
	 *
	 * @type {String}
	 */
	var _directive_ = 'directive';

	/**
	 * Default dimension values.
	 * 
	 * @type {Object}
	 */
	var defaults = {
		headerHeight: 48,
		footerHeight: 32,
		navWidth: 240
	};

	angular

		.module('ek.mobileFrame', [])

		/**
		 * Handles the navigation-toggling and holds dimension data.
		 */
		.controller('MobileFrameCtrl', [
			'$scope',
			'$window',
			'$location',
			function ($scope, $window, $location) {

				var that = this;

				/**
				 * Setting the default dimensions.
				 */
				angular.extend(this, defaults);

				/**
				 * Navigation is currently visible;
				 * 
				 * @type {Boolean}
				 */
				this.navVisible = false;

				/**
				 * Navigation is currently animating.
				 * 
				 * @type {Boolean}
				 */
				this.navAnimating = false;

				/**
				 * Toggling the animation.
				 * 
				 * @param  {String|Object} arg1 Current `$location.path()` or event-object.
				 * @param  {String} [arg2]      Previous `$location.path()`
				 * @return {undefined}
				 */
				this.toggleNav = function toggleNav(arg1, arg2) {
				
					var val = this.navVisible ? 0 : this.navWidth,
						byDirtyCheck = angular.isString(arg1) && angular.isString(arg2),
						animMethod;

					if ( byDirtyCheck && (!this.navVisible || arg1 === arg2 ) || this.navAnimating ) {
						return;
					}

					/**
					 * Holy fugliness! But who wants to test for `translate3d`-support …?!
					 */
					this.$frame.attr('style', [
						'-webkit-transform: translateX(' + val + 'px); ',
						'-moz-transform: translateX(' + val + 'px); ',
						'transform: translateX(' + val + 'px); ',
						'-webkit-transform: translate3d(' + val + 'px, 0, 0); ',
						'-moz-transform: translate3d(' + val + 'px, 0, 0); ',
						'transform: translate3d(' + val + 'px, 0, 0);',
						'padding-left: ' + this.navWidth + 'px; ',
						'left: ' + (-this.navWidth) + 'px;'
					].join(''));
					this.navVisible = !this.navVisible;

				};

				/**
				 * Computes the height of the content-element with respect
				 * to the height of the header and footer.
				 * 
				 * @return {Number} The height of the content-element.
				 */
				this.contentHeight = function contentHeight() {
					return $window.innerHeight - (this.headerHeight + this.footerHeight);
				};

				/**
				 * Watching the `$location.path` to hide navigation on change.
				 */
				$scope.location = $location;
				$scope.$watch('location.path()', this.toggleNav.bind(this));

			}
		])

		/**
		 * The `<mobile-frame>`-element
		 */
		[_directive_]('mobileFrame', function () {

			return {
				restrict: 'E',
				transclude: true,
				scope: true,
				replace: true,
				controller: 'MobileFrameCtrl',
				template: '<section class="mobile-frame" ng-transclude></section>',
				link: function link($scope, $elem, $attrs, mobileFrameCtrl) {

					mobileFrameCtrl.$frame = $elem.css({
						paddingLeft: mobileFrameCtrl.navWidth + 'px',
						left: -mobileFrameCtrl.navWidth + 'px'
					});

				}
			};
		})

		/**
		 * The `<mobile-header>`-element
		 */
		[_directive_]('mobileHeader', function () {
			return {
				restrict: 'E',
				require: '^mobileFrame',
				transclude: true,
				replace: true,
				priority: 200,
				template: [
					'<header class="mobile-header" role="banner">',
					'	<button type="button" class="mobile-nav__toggle" id="mobile-nav-toggle">Toggle</button>',
					'	<div class="mobile-header__inner" ng-transclude></div>',
					'</header>'
				].join(''),
				link: function link($scope, $elem, $attrs, mobileFrameCtrl) {
					if ( $attrs.height !== undefined ) {
						mobileFrameCtrl.headerHeight = parseInt($attrs.height, 10);
					}
					$elem.css('height', mobileFrameCtrl.headerHeight + 'px');
					angular.element(
						document.getElementById('mobile-nav-toggle')
					).on('click', mobileFrameCtrl.toggleNav.bind(mobileFrameCtrl));
				}
			};
		})

		/**
		 * The `<mobile-nav>`-element
		 */
		[_directive_]('mobileNav', function () {
			return {
				restrict: 'E',
				require: '^mobileFrame',
				transclude: true,
				replace: true,
				priority: 200,
				template: [
					'<div class="mobile-nav">',
					'	<div class="mobile-nav__inner" ng-transclude></div>',
					'</div>'
				].join(''),
				link: function link($scope, $elem, $attrs, mobileFrameCtrl) {

					if ( $attrs.width !== undefined ) {
						mobileFrameCtrl.navWidth = parseInt($attrs.width, 10);
					}

					$elem.css('width', mobileFrameCtrl.navWidth + 'px');

				}
			};
		})

		/**
		 * The `<mobile-content>`-element
		 */
		[_directive_]('mobileContent', ['$window', function ($window) {

			function setHeight($elem) {
				var that = this;
				requestAnimationFrame(function () {
					$elem.css('height', that.contentHeight() + 'px');
				});
			}

			return {
				restrict: 'E',
				require: '^mobileFrame',
				transclude: true,
				replace: true,
				priority: 100,
				scope: true,
				template: [
					'<div class="mobile-content" role="main">',
					'	<div class="mobile-content__inner" ng-transclude></div>',
					'</div>'
				].join(''),
				link: function link($scope, $elem, $attrs, mobileFrameCtrl) {
					angular.element($window).on('resize', setHeight.bind(mobileFrameCtrl, $elem));

					// little hacky, but `footerHeight` doesn't want to appear in time … o.O
					$scope.$watch('mobileFrameCtrl.headererHeight', setHeight.bind(mobileFrameCtrl, $elem));
					$scope.$watch('mobileFrameCtrl.footerHeight', setHeight.bind(mobileFrameCtrl, $elem));
				}
			};
		}])

		/**
		 * The `<mobile-footer>`-element
		 */
		[_directive_]('mobileFooter', function () {
			return {
				restrict: 'E',
				require: '^mobileFrame',
				transclude: true,
				replace: true,
				priority: 200,
				template: [
					'<footer class="mobile-footer">',
					'	<div class="mobile-footer__inner" ng-transclude></div>',
					'</footer>'
				].join(''),
				link: function link($scope, $elem, $attrs, mobileFrameCtrl) {
					if ( $attrs.height !== undefined ) {
						mobileFrameCtrl.footerHeight = parseInt($attrs.height, 10);
					}
					$elem.css('height', mobileFrameCtrl.footerHeight + 'px');
				}
			};
		});

})(angular);