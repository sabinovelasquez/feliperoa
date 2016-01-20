'use strict';
'https://www.facebook.com/media/set/?set=a.1018174751586914.1073741827.330384133699316&type=3'
var app = angular

	.module('app', ['ngAnimate','ui.bootstrap', 'angular-parallax', 'duScroll', 'ngTweets'])
  .factory('QueueService', [ '$rootScope',
    function ($rootScope) {
      var queue = new createjs.LoadQueue(true);
  
      function loadManifest(manifest) {
          queue.loadManifest(manifest);
  
          queue.on('progress', function (event) {
              $rootScope.$broadcast('queueProgress', event);
          });
  
          queue.on('complete', function () {
              $rootScope.$broadcast('queueComplete', manifest);
          });
      }
  
      return {
          loadManifest: loadManifest
      }
    }
  ])
  .animation('.slide-animation', [ '$window',
    function ($window) {
      return {
          enter: function (element, done) {
              var startPoint = $window.innerWidth * 0.5,
                  tl = new TimelineLite();
              
              tl.fromTo(element.find('.bg'), 1, { alpha: 0}, {alpha: 1})
              .fromTo(element.find('.subtitle'), 3, { marginLeft: -20, alpha: 0}, {marginLeft: 0, alpha: 1, ease: Ease.easeInOut, onComplete: done});
  
          },
  
          leave: function (element, done) {
              var tl = new TimelineLite();
  
              tl.to(element, 1, {alpha: 0, onComplete: done});
          }
      };
    }
  ])
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
  .filter('html', ['$sce',
    function ($sce) {
      return function (str) {    
        var breaklines = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2');
        return $sce.trustAsHtml(breaklines);
      }
    }
  ])
  .filter('fb_link', ['$sce',
    function ($sce) {
      return function (str) {    
        var postid = str.split('_');
        var url = postid[0]+'/posts/'+postid[1];
        return $sce.trustAsHtml(url);
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
        var breaklines = (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2');
        return $sce.trustAsHtml(breaklines);
      }
    }
  ])
  .controller('headerCtrl', [ '$scope', '$http', '$timeout', 'QueueService',
    function($scope, $http, $timeout, QueueService) {
      var fbUrl = 'https://graph.facebook.com/1018174751586914/photos?access_token=1411529029115730|0zfGXNTWB508RC3Z6JvR4UisYDM&callback=JSON_CALLBACK',
          INTERVAL = 8000,
          slides = [];
      $scope.getCover = function() {
        $http.jsonp( fbUrl )
        .success(function(json) {
          var slidesArr = json.data;
          
          angular.forEach(slidesArr, function(value, key){
            var img = {};
            
            var tempname= value.name;
            img.src = value.images[0].source;

            if(tempname){
              tempname= value.name.split(',');  
              img.name = tempname[0];
              img.url = tempname[1];
            }
            if( img.src ){
              slides.push(img);
            }
            
          });
          loadSlides();
          // $scope.fbfeed = posts; encodeURIComponent(imgs[i].name)decodeURIComponent(photo[1])
          
        });
      };
      

      function setCurrentSlideIndex(index) {
          $scope.currentIndex = index;
      }

      function isCurrentSlideIndex(index) {
          return $scope.currentIndex === index;
      }

      function nextSlide() {
          $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
          $timeout(nextSlide, INTERVAL);
      }

      function setCurrentAnimation(animation) {
          $scope.currentAnimation = animation;
      }

      function isCurrentAnimation(animation) {
          return $scope.currentAnimation === animation;
      }

      function loadSlides() {
          QueueService.loadManifest(slides);
      }

      $scope.$on('queueProgress', function (event, queueProgress) {
          $scope.$apply(function () {
              $scope.progress = queueProgress.progress * 100;
          });
      });

      $scope.$on('queueComplete', function (event, slides) {
          $scope.$apply(function () {
              $scope.slides = slides;
              $scope.loaded = true;

              $timeout(nextSlide, INTERVAL);
          });
      });

      $scope.progress = 0;
      $scope.loaded = false;
      $scope.currentIndex = 0;
      $scope.currentAnimation = 'slide-left-animation';

      $scope.setCurrentSlideIndex = setCurrentSlideIndex;
      $scope.isCurrentSlideIndex = isCurrentSlideIndex;
      $scope.setCurrentAnimation = setCurrentAnimation;
      $scope.isCurrentAnimation = isCurrentAnimation;

      $scope.getCover();
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
  .controller('aboutCtrl', [ '$scope', '$http',
    function($scope, $http) {
      var fbUrl = 'https://graph.facebook.com/330384133699316/?fields=description_html&access_token=1678105279117334|492e729a21cc860f8694fe84c03a755c&callback=JSON_CALLBACK';
      $scope.getDesc = function() {
        $http.jsonp( fbUrl )
        .success(function(response) {
          $scope.description_html = response.description_html;
        });
      };
      $scope.getDesc();
    }
  ])
  .controller('fbCtrl', [ '$scope', '$http',
    function($scope, $http) {
      var fbUrl = 'https://graph.facebook.com/330384133699316/feed?access_token=1678105279117334|492e729a21cc860f8694fe84c03a755c&callback=JSON_CALLBACK';
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
        });
    }
  ]);
  
  