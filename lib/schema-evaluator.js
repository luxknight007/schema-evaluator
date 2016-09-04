/*  Created by Zoilo Dela Cruz
*   Date September 4, 2016
*/
module.exports = (function() {
    var services = {
        hello: hello
    };

    return services;

    function hello ( ){
        return "hello world";
    }

})();