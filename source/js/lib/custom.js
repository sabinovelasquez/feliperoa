'use strict';

var app = angular

	.module('app', ['ngAnimate','ui.bootstrap', 'angular-parallax', 'duScroll'])

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
		
	]);