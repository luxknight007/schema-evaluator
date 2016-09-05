/*  Created by Zoilo Dela Cruz
*   Date September 4, 2016
*/

var inspector = require('schema-inspector');
var lodash = require('lodash');

module.exports = (function() {
    var services = {
        validate: validate,
        sanitize: sanitize,
        strict_evaluate:strict_evaluate,
        evaluate_clean: evaluate_clean,
        generateSchema: generateSchema
        
    };

    return services;

    function validate(schema, object){
        return inspector.validate(schema, object);
    }

    function sanitize(schema, object){
        return inspector.sanitize(schema, object);
    }

    function strict_evaluate(schema, object) {
        //setDefaultValue(schema, object);

        /*let us sanitized first before validate
        *   with sanitize if the properties is integer and you pass a data of string "22" it will convert it into
        *   an integer same with date from 722517795000 to date format 1992-11-23T11:33:15.0
        *   boolean 0 to false and 1 to true.
        *
        *   With sanitize here where you define the rules if capitalize, proper case, etc.
        */
        inspector.sanitize(schema, object);

        //let us validate the data and send response if data is in wrong format
        return inspector.validate(schema, object);
    }

    function evaluate_clean(schema, object){
        var cleanedObject = strict_evaluate(schema,object);
        //console.log('cleanObject ',cleanedObject);
        if (!cleanedObject.valid) {
            return cleanedObject;
        } else {
            //console.log('SCHEMA ', cleanedObject);
            return checkKeys(schema.properties, object, cleanedObject);
            //return sanitizedObject;
        }
    }

    function checkKeys(schema, object, cleanedObject){
            if (undefined !== schema && undefined !== object) {
                var objectKeys = Object.keys(object).sort();
                var objectCopy = object;
                var optional_array = ['array', 'null'];
                var optional_object = ['object', 'null'];
                var current_schema = {};
                for (var l = 0; l < objectKeys.length; l++) {
                    var type = '';
                    current_schema = schema[objectKeys[l]];
                    if ((typeof current_schema !== 'undefined') && (typeof current_schema.type !== 'undefined')) {
                        //console.log(objectKeys[l], ' === ', schema[objectKeys[l]].type, ' ====== ', objectCopy[objectKeys[l]]);
                        type = schema[objectKeys[l]].type.toString();
                    }

                    if (!lodash.has(schema, objectKeys[l])) {
                        cleanedObject.error.push({code:null, message:'Excess field ', property: '@ '+objectKeys[l] });
                        cleanedObject.valid = false;
                        //delete objectCopy[objectKeys[l]];
                    } else if (type === 'object' || type === optional_object.toString()) {
                        if (null !== objectCopy[objectKeys[l]]) {
                            var subBKeys = Object.keys(objectCopy[objectKeys[l]]).sort();
                            for (var u = 0; u < subBKeys.length; u++) {
                                checkKeys(schema[objectKeys[l]].properties, objectCopy[objectKeys[l]], cleanedObject);
                            }
                        }
                    } else if ((type === 'array' || type === optional_array.toString())) {
                        if (null !== objectCopy[objectKeys[l]]) {
                            var arrayLength = objectCopy[objectKeys[l]].length;
                            for (var x = 0; x < arrayLength; x++) {
                                if (schema[objectKeys[l]].items.type === 'array') {
                                    checkKeys(schema[objectKeys[l]].items, objectCopy[objectKeys[l]][x], cleanedObject);
                                } else {
                                    checkKeys(schema[objectKeys[l]].items.properties, objectCopy[objectKeys[l]][x], cleanedObject);
                                }

                            }
                        }
                    }
                }
                return cleanedObject;
            }
        }

    //Recursive object
    function setRecursiveObjects(schemaObject, jsonObject, keyProperty) {
        var recursedObject = schemaObject;

        //If Type is an array, add items property,
        if (recursedObject.properties[keyProperty]['type'] === "array") {
            recursedObject.properties[keyProperty]['items'] = generateSchema(jsonObject[keyProperty][0]);
        }

        //If Type is an object, add items property,
        if (recursedObject.properties[keyProperty]['type'] === "object") {
            recursedObject.properties[keyProperty] = generateSchema(jsonObject[keyProperty]);
        }

        return recursedObject;

    }

    //Set Properties
    function getPropertyType(jsonProperty) {
            var propertyType = ['object', 'string', 'null'];
            if (null !== jsonProperty) {
                switch (jsonProperty.constructor) {
                    case String:
                        propertyType = 'string';
                        break;
                    case Object:
                        propertyType = 'object';
                        break;
                    case Number:
                        propertyType = 'number';
                        break;
                    case Array:
                        propertyType = 'array';
                        break;
                    case Date:
                        propertyType = ['date', 'number'];
                        break;
                    default:
                        propertyType = ['object', 'string', 'null'];
                        break;
                }
            }
            return propertyType;
        }

    function generateSchema(object) {
            var schemaObject = {};
            if (undefined !== object && undefined !== object.constructor) {
                if (object.constructor === Object) {
                    schemaObject.def = null;
                    schemaObject.type = 'object';
                    schemaObject.properties = {};
                    var keyProperty = lodash.keys(object);
    
                    for (var counter = 0; counter < lodash.size(object); counter++) {
                        schemaObject.properties[keyProperty[counter]] = {};
    
                        //Set Schema Optional (true/false)
                        schemaObject.properties[keyProperty[counter]]['optional'] = false;
    
                        //Set Schema Default
                        schemaObject.properties[keyProperty[counter]]['def'] = null;
    
                        //Set Schema Type
                        schemaObject.properties[keyProperty[counter]]['type'] = getPropertyType(object[keyProperty[counter]]);
                        schemaObject = setRecursiveObjects(schemaObject, object, keyProperty[counter]);
                    }
                } else {
                    schemaObject.type = ['string', 'object', 'null'];
                    schemaObject.def = null;
                    schemaObject.optional = false;
                }
            }
    
            return schemaObject;
        }
})();