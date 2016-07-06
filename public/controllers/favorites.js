(function() {
    var app = angular.module('rav');

    app.controller('FavoritesController', ['$http', function($http) {
        console.log('getting favorites');
        var rav = this;
        rav.favorites = {};
        rav.error = null;

        $http.get('/protected/favorites')
            .success(function(data) {
                rav.favorites = data.favorites;
                console.log(data.favorites);
            })
            .error(function(data) {
                rav.error = data;
                console.log(rav.error);
            });
        this.isDesigner = function(favorite) {
            return favorite.type === 'designer';
        };
    }]);
})();
