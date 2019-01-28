define(['plugins/http', 'xss'],
    function (http, xss) {
        'use strict';

        function load(contentUrl) {
            return http.get(contentUrl).then(function(content) {
                return xss.filter(content);
            });
        }

        return {
            load: load
        };
    }
);