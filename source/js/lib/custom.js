'use strict';

var app = angular

	.module('app', ['ngAnimate','ui.bootstrap', 'angular-parallax', 'duScroll', 'ngTweets'])
  .filter('scplayer', ['$sce',
    function ($sce) {
      return function (str) {
        return $sce.trustAsHtml(str);
      }
    }
  ])
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
  .controller('scCtrl', [ '$scope', '$http',
    function($scope, $http) {
      var scUrl = 'http://soundcloud.com/oembed?format=js&url=https://soundcloud.com/felipe-acaro&callback=JSON_CALLBACK';
      $scope.getTracks = function() {
        $http.jsonp( scUrl )
        .success(function(response) {
          $scope.html = response.html;
        });
      };
      $scope.getTracks();
    }
  ])
  .controller('ytCtrl', [ '$scope', '$http',
    function($scope, $http) {
      var ytUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=UUwQNQR-59PltETBr4u59ZmQ&key=AIzaSyBdVTgDKI28TVldzE_JNKJpkDnTHRkANPY&callback=JSON_CALLBACK';
      var arrVids = [];
      $scope.getVideos = function() {
        $http.jsonp( ytUrl )
        .success(function(response) {
          $scope.infoVids = response.items;
          angular.forEach(response.items, function(value, key){

            $scope.getVideoId(value.contentDetails.videoId);
            
          });

          
        });
      };
      $scope.getVideoId = function(videoId) {
        $http.jsonp( 'https://www.googleapis.com/youtube/v3/videos?id='+videoId+'&part=snippet,contentDetails,status&key=AIzaSyBdVTgDKI28TVldzE_JNKJpkDnTHRkANPY&callback=JSON_CALLBACK')
        .success(function(response) {
          var vid = response.items[0].snippet;
          vid.id = videoId;
          arrVids.push(vid);
        });
      };
      $scope.videos = arrVids;
      $scope.getVideos();
    }
  ])
  .controller('instagramCtrl', [ '$scope', '$http',
    function($scope, $http) {
      var instagram_json = 'https://api.instagram.com/v1/users/27730958/media/recent/?client_id=8a5f05fceb2c42299239597c6ded2f8e&count=8&callback=JSON_CALLBACK'
      $http.jsonp( instagram_json )
        .success(function(response) {
          $scope.photos = response.data;
          console.log($scope.photos);
        });
    }
  ]);
  
  