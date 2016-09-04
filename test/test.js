var schema = require('../lib/schema-evaluator');

function testing(){
    var data = 'hello world';
    result = schema.hello();
    console.log('HERE', result);
    return result;
};

testing();