ALPHA Version:
SEPTEMBER 6, 2016 Changelogs:
* generateSchema is now generate_schema for a uniform call.

A powerful tool for evaluating, validate, sanitize JSON object.

Schema-Evaluator requires a certain knowledge of Schema-Inspector.
For basic knowledge and application, follow this link: http://atinux.github.io/schema-inspector/

What is the main purpose of Schema-Evaluator?
Using Schema-Inspector outright was useful but we thought it needed some extra sanitation and validation functions for
developers to use both for development and production. This tool takes the sanitzation and validation processes further
by being able to:
- Automatically generate a templated SCHEMA Object by passing a JSON object into the generate_schema function. Extra
configurations should be done by the developer; but most of the hassle by common objects and arrays are done by this function.
- Reports extra properties that were not indicated by the SCHEMA object by using the evaluate_clean function

SOURCE CODE EXAMPLE ON USAGE:
1.) Execute "node test" inside the  schema-evaluator OR...
2.) Follow the code on the following lines...

var evaluator = require('../lib/schema-evaluator');

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

var jsonObject = {
        name: 'NikitaJS',
        age: 20,
        id: 'AbcdefgZ',
        site1: 'http://google.com',
        site2: 'http://google.com',
        site3: 'http://google.com',
        stuff: ['JavaScript', null, 1234, 'test'],
        stuff2: { name: 'sample', description: 'sample description'}
    };

var result_validate = evaluator.validate(schema, jsonObject);
console.log('RESULT VALIDATE ', result_validate);

var result_strict_evaluate = evaluator.strict_evaluate(schema, jsonObject);
console.log('RESULT STRICT_EVALUATE ', result_strict_evaluate);

var result_clean = evaluator.evaluate_clean(schema, jsonObject);
console.log('RESULT EVALUATE_CLEAN ', result_clean);

var schemaResult = evaluator.generate_schema(jsonObject);
console.log('RESULT JSON TO SCHEMA ', schemaResult);
console.log('ITEMS INSIDE stuff.items', schemaResult.properties.stuff.items);