var app = angular.module('app', []);

            app.controller('neon', function($scope, $element){
            var _name = 'OWAT';
            $scope.user = {
                name: function(newName) {
                return arguments.length ? (_name = newName) : _name;
                }
            };
            $scope.getColor = function(color){
                $scope.color = color;
            };
            var _color = ['pink'];
            $scope.getColor(_color[0]);
            });

            window.onload = function() {
            const motionElement = document.getElementById('motionElement');
            console.log(motionElement)
            setTimeout(function() {
                motionElement.classList.add('hidden');
            }, 1000); // 2초 후에 요소 숨김

            motionElement.addEventListener('transitionend', function() {
                if (motionElement.classList.contains('hidden')) {
                    motionElement.style.display = 'none';
                }
            });
        }