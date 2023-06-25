// @ts-check

const { connection } = require("./connection");
const { v4 } = require("uuid");

/**
 *
 * @param {any} array
 * @param {string[]} attributes
 */
const arrayToSQL = (array, attributes) => {
  let string = "";
  attributes.forEach((attribute, i) => {
    if (array[attribute] !== undefined)
      string += `${
        typeof array[attribute] === "string"
          ? `'${array[attribute]}'`
          : array[attribute]
      }`;
    if (i < attributes.length - 1) string += ",";
  });
  return string;
};

/**
 *
 * @param {any} array
 * @param {string[]} attributes
 */
const arrayToUPDATE = (array, attributes) => {
  let string = "";
  attributes.forEach((attribute, i) => {
    if (array[attribute] !== undefined)
      string += `${attribute} = ${
        typeof array[attribute] === "string"
          ? `'${array[attribute]}'`
          : array[attribute]
      }`;
    if (i < attributes.length - 1) string += ",";
  });
  return string;
};

/**
 * @param {any} where
 */
const prepareWhere = (table, where) => {
  try {
    if (where.length) {
      let string = "WHERE";
      let atLeastOne = false;
      where.forEach(
        (
          /** @type {{ attribute: any; operator: any; value: any; value1: any; logic: any; }} */ cond,
          /** @type {number} */ i
        ) => {
          if (
            cond.attribute !== undefined &&
            cond.operator !== undefined &&
            cond.value !== undefined
          ) {
            atLeastOne = true;
            const { attribute, operator, value, value1, logic } = cond;
            switch (operator) {
              case "BETWEEN":
                string += ` ${
                  i !== 0 ? logic : ""
                } BETWEEN ${value} AND ${value1}`;
                break;
              case "IN":
                string += ` ${
                  i !== 0 ? logic : ""
                } ${attribute} IN (${value.toString()})`;
                break;
              default:
                string += ` ${i !== 0 ? logic : ""} ${attribute} ${operator} ${
                  typeof value === "string" &&
                  table.indexOf(value.split(".")[0]) < 0
                    ? `'${value}'`
                    : value
                }`;
                break;
            }
          }
        }
      );
      if (atLeastOne) return string;
      return "";
    } else if (
      where.attribute !== undefined &&
      where.operator !== undefined &&
      where.value !== undefined
    ) {
      const { attribute, operator, value, value1 } = where;
      switch (operator) {
        case "BETWEEN":
          return `WHERE ${attribute} BETWEEN ${value} AND ${value1}`;
        case "IN":
          return `WHERE ${attribute} IN (${value.toString()})`;
        default:
          return `WHERE ${attribute} ${operator} ${
            typeof value === "string" ? `'${value}'` : value
          }`;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return "";
};

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {number} count
 */
const preparePagination = (start, end, count) => {
  if (start > 0 || count > 0) {
    if (start && end) return `LIMIT ${start},${end}`;
    else if (start && !end) return `LIMIT ${start},18446744073709551615`;
    if (!start && !end) return `LIMIT ${count}`;
  }
  return "";
};

/**
 *
 * @param {string[]} attributes
 */
const attributesToString = (attributes) => {
  let result = "";
  attributes.forEach((att, i) => {
    result += att;
    if (i < attributes.length - 1) result += ",";
  });
  return result;
};

/**
 *
 * @param {string} table
 * @param {string[]} attributes
 * @param {object} values
 * @returns
 */
const insert = async (table, attributes, values) => {
  const id = v4();
  const connectionA = connection.db;
  await connectionA?.execute(
    `INSERT INTO ${table}(${attributesToString(
      attributes
    )}) VALUES(${arrayToSQL({ id, ...values }, attributes)})`
  );
  return id;
};

/**
 *
 * @param {string} table
 * @param {string[]} attributes
 * @param {object} values
 * @param {any} where
 * @returns
 */
const update = async (table, attributes, values, where) => {
  const connectionA = connection.db;
  const result = await connectionA?.execute(
    `UPDATE  ${table} SET ${arrayToUPDATE(values, attributes)} ${prepareWhere(
      table,
      where
    )}`
  );
  return result;
};

/**
 *
 * @param {any} table
 * @param {string[]} attributes
 * @param {any} where
 * @param {number} count
 * @param {number} start
 * @param {number} end
 */
const select = async (
  table,
  attributes,
  where,
  start = 0,
  end = 0,
  count = 0,
  orderBy = ""
) => {
  const connectionA = connection.db;
  const [rows] = await connectionA?.execute(
    `SELECT ${
      attributes && attributes.length ? attributesToString(attributes) : "*"
    } FROM ${
      typeof table === "string" ? table : table.toString()
    } ${prepareWhere(table, where)} ${preparePagination(start, end, count)} ${
      orderBy && orderBy.length ? `ORDER BY ${orderBy}` : ""
    }`
  );
  return { rows };
};

/**
 *
 * @param {string} table
 * @param {any} where
 */
const deleteDocuments = async (table, where) => {
  const connectionA = connection.db;
  const result = await connectionA?.execute(
    `DELETE FROM ${table} ${prepareWhere(table, where)}`
  );
  return result;
};

module.exports = {
  insert,
  select,
  update,
  deleteDocuments,
};
