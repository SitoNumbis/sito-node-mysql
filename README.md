# sito-node-mysql

sito-node-mysql @1.10.1

# Create connection

```
    const { connection } = require("sito-node-mysql");
    
    connection.init({host, user, password, database});

    // you can initialize your connection in the application

```

After the creation of the connection you can use the CRUD methods

# Functions

_Using [mysql2](https://www.npmjs.com/package/mysql2)_

## insert (table: string, attributes: string[], values: object)

```
    const { insert } = require("sito-node-mysql");

    /* ⚠ If you pass 'id' will override uuid id auto generated ⚠ */
    const result = insert("users", ["id", "user", "name"], { user: "sito8943", name: "Sito" })

    // sql => INSERT INTO users(id, name) VALUES('<uuid>', 'Sito');

```

## update (table: string, attributes: string[], values: object, where: any)

```
    const { update } = require("sito-node-mysql");

    const result = update("users", ["name"], { name: "SitoNumbis" }, { attribute: "user", operator: "=", value: "sito8943" })

    // sql => UPDATE users SET name='SitoNumbis' WHERE user='sito8943';

```

## select (table: string || string[], attributes: string[], where: any, start: number, end: number)

```
    const { select } = require("sito-node-mysql");

    const result = select("users", ["name"], { attribute: "user", operator: "=", value: "sito8943" })

    // sql => SELECT name FROM users WHERE user='sito8943';

```

## deleteDocuments (table: string, where: any)

```
    const { deleteDocuments } = require("sito-node-mysql");

    const result = deleteDocuments("users", { attribute: "user", operator: "=", value: "sito8943" })

    // sql => DELETE FROM users WHERE user='sito8943';

```

## WHERE syntax !!! IMPORTANT

### Where as object (single where)

```
{
    attribute: "string",
    operator: "=" // can be =, >, <, >=, <=, <>, BETWEEN, LIKE, IN
    value: "string", // or number, NOTE can be and array if you are using IN operator
    value1: "string" or number // if you are using BETWEEN operator
    parenthesis: string // this will type the 'parenthesis' '(' or ')' exactly in the location
}
```

### Where as array (multi where)

```
[{
    attribute: "string",
    operator: "=" // can be =, >, <, >=, <=, <>, BETWEEN, LIKE, IN
    value: "string", // or number, NOTE can be and array if you are using IN operator
    value1: "string" or number // if you are using BETWEEN operator
    logic: "AND", // or "OR" the firs logic will be not taken
}]
```
