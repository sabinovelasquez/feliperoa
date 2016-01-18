'use strict';

var app = angular

	.module('app', ['ngAnimate','ui.bootstrap', 'angular-parallax', 'duScroll', 'ngTweets'])
	.filter('linkytw', ['$sce',
    function ($sce) {
      return function (str) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        str = str.replace(exp, "<a href='$1' target='_blank'>$1</a>");
        exp = /(^|\s)#(\w+)/g;
        str = str.replace(exp, "$1<a href='https://twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
        exp = /(^|\s)@(\w+)/g;
        str = str.replace(exp, "$1<a href='https://www.twitter.com/$2' target='_blank'>@$2</a>");
        return $sce.trustAsHtml(str);
      }
    }
  ])
  .filter('dateformat', ['$sce',
    function ($sce) {
      return function (str) {
        // var date = moment(str).startOf('day').fromNow();    
        var date = moment(str).format('ll');
        var ndate = date.split(',');
        date = ndate[0];
        ndate = date.split(' ');
        var day = ndate[1];
        if(day.length<2){
          day = '0'+ndate[1];
        }
        date = day+' '+ndate[0];

        return $sce.trustAsHtml(date);
      }
    }
  ])
  .filter('linkyfb', ['$sce',
    function ($sce) {
      return function (str) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        str = str.replace(exp, "<a href='$1' target='_blank'>$1</a>");
        exp = /(^|\s)\n(\w+)/g;
        str = str.replace(exp, "<br>");
        return $sce.trustAsHtml(str);
      }
    }
  ])
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
	.controller('twCtrl', [ '$scope', 'tweets',
    function($scope, tweets) {
      $scope.getTweets = function() {
        tweets.get({
          widgetId: '689046590473039872'
        }).success(function(data) {
          $scope.twfeed = data;
        });
      };
      $scope.getTweets();
    }
  ])
  .controller('fbCtrl', [ '$scope', '$http',
    function($scope, $http) {
      var fbUrl = 'https://graph.facebook.com/330384133699316/feed?access_token=1411529029115730|0zfGXNTWB508RC3Z6JvR4UisYDM&callback=JSON_CALLBACK';
      $scope.getPosts = function() {
        $http.jsonp( fbUrl )
        .success(function(response) {
          var posts = _.reject(response.data, function(msj){ return !msj.message; });
          $scope.fbfeed = posts;
        });
      };
      $scope.getPosts();
    }
  ])
