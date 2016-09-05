var evaluator = require('../lib/schema-evaluator');

function testing(){
    var schema = {
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 4, maxLength: 12 },
            age: { type: 'number', gt: 0, lt: 100 },
            id: { type: 'string', exactLength: 8, pattern: /^A.{6}Z$/ },
            site1: { type: 'string', pattern: 'url' },
            stuff: {
                type: 'array',
                minLength: 2,
                maxLength: 8,
                items: {
                    type: ['string', 'null', 'number'],
                    minLength: 1
                }
            },
            stuff2: {
                type: 'object',
                properties: {
                    name: { type: 'string'}
                }
            }
        }
    };

    var candidate = {
        name: 'NikitaJS',
        age: 20,
        id: 'AbcdefgZ',
        site1: 'http://google.com',
        site2: 'http://google.com',
        site3: 'http://google.com',
        stuff: ['JavaScript', null, 1234, 'test'],
        stuff2: { name: 'sample', description: 'sample description'}
    };
    var result_validate = evaluator.validate(schema, candidate);
    console.log('RESULT VALIDATE ', result_validate);

    var result_strict_evaluate = evaluator.strict_evaluate(schema, candidate);
    console.log('RESULT STRICT_EVALUATE ', result_strict_evaluate);

    var result_clean = evaluator.evaluate_clean(schema, candidate);
    console.log('RESULT EVALUATE_CLEAN ', result_clean);

    var schemaResult = evaluator.generateSchema(candidate);
    console.log('RESULT JSON TO SCHEMA ', schemaResult);
    console.log('ITEMS ', schemaResult.properties.stuff.items);
}

testing();