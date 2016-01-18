'use strict';

var app = angular

	.module('app', ['ngAnimate','ui.bootstrap', 'angular-parallax', 'duScroll', 'ngTweets'])
	.filter('linky', function ($sce) {
		return function (str) {
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
			str = str.replace(exp, "<a href='$1' target='_blank'>$1</a>");
			exp = /(^|\s)#(\w+)/g;
			str = str.replace(exp, "$1<a href='https://twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
			exp = /(^|\s)@(\w+)/g;
			str = str.replace(exp, "$1<a href='https://www.twitter.com/$2' target='_blank'>@$2</a>");
			return $sce.trustAsHtml(str);
		}
	})
	.controller('gralCtrl', [ '$scope', '$document', 
		function($scope, $document) {
			$scope.head = false;
			$scope.lang = 1;
			$document.on('scroll', function() {
				if( $document.scrollTop() > 330 ){
					$scope.head = true;
				}else{
					$scope.head = false;
				}
				$scope.$apply();
			});
		}
		
	])
	.controller('socialCtrl', [ '$scope', 'tweets',
		function($scope, tweets) {
			$scope.getTweets = function() {
				tweets.get({
					widgetId: '689046590473039872'
				}).success(function(data) {
					$scope.feed = data;
				});
			}
			$scope.getTweets();
		}
	])
	