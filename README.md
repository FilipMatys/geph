# Geph Framework 
Framework for TypeScript projects to help keep data definition and flow unified between mobile, frontend and backend.

`This framework is still under development and is a subject to change. We use this framework for our projects and was created to make our job easier, but feel free to use and fork howewer you wish.`

## Packages
### Core
Contains core tools for data flow.

#### @Import(clazz: new() => T, enumerable?: boolean)
This simple decorator creates intance of given class. This allows you to keep your code clean and avoid initializing your services manually or to have massive constructor.
```javascript
// Import tool
import { Import } from '@geph/core';

// Some custom class
export class CustomClass {

    @Import(CustomService)
    private customService: CustomService;

    // Constructor
    constructor() {
        // Now, you can use customService!
        this.customService.doSomeMagic();
    }
}
```

#### ValidationResult\<T\>(data: T)
ValidationResult is a class, that helps code communicate. It wraps data that need to be transported from one place to another, while keeping all error, warning and success messages. ValidationResult has isValid flag, which tells you if something went wrong on the way.
```javascript
// Import tool
import { ValidationResult } from '@geph/core';

...
// Initialize validation
let validation = new ValidationResult<CustomEntity>(entity);

// Call some function, that also returns validation
let customFunctionValidation = this.service.doSomeMagic();

// Check custom validation
if (!customFunctionValidation.isValid) {
    // Something went wrong, so merge validations
    // This merges all error, warning and success messages
    // and sets proper isValid flag. 'validation' data is 
    // kept, the other data is ignored
    validation.append(customFunctionValidation);
}

// Now check something else
if (now !== rightNow) {
    // Add error to validation
    // This automatically sets isValid to false
    validation.addError('Right now is not now..?!');
}
else {
    // Add success message
    // This does NOT change isValid flag
    validation.addSuccess('Oh, we made it through.');
}
...

// Return validation
return validation;
```
***

### Serializable
Tools to keep data definitions at one place. They help to define data one way and then transform these definitions as needed. This is useful for projects, that need to use the same data model, but use different approaches (if any) to store them, like SqLite vs Mongoose.  

#### @Entity()
Decorator, that defines basic entity properties. 

```javascript 
// Import tool
import { Entity } from '@geph/serializable';

// Create some basic entity
@Entity({
    // Name of entity. Storage extensions use this a table/document name.
    name: 'CustomEntity',
    // Whether to keep track of identifier
    _id: true,
    // Whether to keep track of updateAt, createdAt
    timestamps: false
})
export class CustomEntity {
...
}

```

#### @Property()
Decorator, that defines property. Is used with @Entity.

`All properties defined this way need to be initialized. Otherwise it won't work.`

```javascript
// Import tools
import { Entity, Property } from '@geph/serializable';

// Create class
@Entity({
    name: 'Person',
    _id: true,
    timestamps: true
})
export class Person {

    // Define age property
    @Property({
        type: Types.INTEGER
    })
    public age: number = 0;

    // Define name property
    @Property({
        type: Types.TEXT,
        isRequired: true
    })
    public name: string = undefined;

    // Define children
    @Property({
        type: Types.REF,
        ref: Person,
        isArray: true
    })
    public children: Person[] = [];

    ...
}

```

#### Serializable
Helper class for serializable entities. The only thing it does is to extend any class with _id, createdAt and updatedAt properties.

```javascript
// Import tool
import { Serializable } from '@geph/serializable';

...
// Extend Person class so TS compiler knows of _id, createdAt and updatedAt properties
export class Person extends Serializable {
...

```

#### Serializer
After data are decorated and defined, the magic comes. Serializer takes any decorated entity and returns complete entity definition. This version returns the same data defined on entity and properties.

```javascript
// Import tool
import { Serializer } from '@geph/serializable';

// Init serializer
let serializer = new Seriaizer();

// Get entity definition
let definition = serializer.getDefinition(Person);
```

#### MongooseSerializer
MongooseSerializer extends Serializer and overrides getDefinition method. The method now returns name and mongoose schema.

```javascript
// Import tool
import { MongooseSerializer } from '@geph/serializable';
// Import mongoose model
import { model } from 'mongoose';

// Init serializer
let mSerializer = new MongooseSeriaizer();

// Get entity definition
let definition = mSerializer.getDefinition(Person);

// Create mongoose model
let personModel =  model(definition.name, definition.schema); 
```