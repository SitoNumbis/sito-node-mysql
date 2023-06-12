// @ts-check

const { db } = require("./connection");
const { v4 } = require("uuid");

/**
 *
 * @param {any} array
 * @param {string[]} attributes
 */
const arrayToSQL = (array, attributes) => {
  let string = "";
  attributes.forEach((attribute, i) => {
    if (array[attribute])
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
    if (array[attribute])
      string += `${attribute} = '${
        typeof array[attribute] === "string"
          ? `'${array[attribute]}'`
          : array[attribute]
      }'`;
    if (i < attributes.length - 1) string += ",";
  });
  return string;
};

/**
 * @param {any} where
 */
const prepareWhere = (where) => {
  try {
    if (where.length) {
    } else if (where.attribute && where.operator && where.value) {
      const { attribute, operator, value } = where;
      return `WHERE ${attribute} ${operator} ${
        typeof value === "string" ? `'${value}'` : value
      }`;
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
  if (start || count) {
    if (start && end) return `${start},${end}`;
    else if (start && !end) return `${start},18446744073709551615`;
    if (!start && !end) return `${count}`;
  }
  return "";
};

/**
 *
 * @param {string} table
 * @param {string[]} attributes
 * @param {any[]} values
 * @returns
 */
const insert = async (table, attributes, values) => {
  const id = v4();
  const connectionA = db;
  const result = await connectionA.execute(
    `INSERT INTO ${table}(${attributes.toString()}) VALUES(${arrayToSQL(
      { id, ...values },
      attributes
    )})`
  );
  return result;
};

/**
 *
 * @param {string} table
 * @param {string[]} attributes
 * @param {any[]} values
 * @param {string} where
 * @returns
 */
const update = async (table, attributes, values, where) => {
  const connectionA = db;
  const result = await connectionA.execute(
    `UPDATE  ${table} SET (${arrayToUPDATE(values, attributes)}) ${prepareWhere(
      where
    )}`
  );
  return result;
};

/**
 *
 * @param {string} table
 * @param {string[]} attributes
 * @param {any} where
 * @param {number} count
 * @param {number} start
 * @param {number} end
 */
const select = async (table, attributes, where, start, end, count) => {
  const connectionA = db;
  const [rows] = await connectionA.execute(
    `SELECT ${
      attributes ? attributes.toString() : "*"
    } FROM ${table} ${prepareWhere(where)} ${preparePagination(
      start,
      end,
      count
    )}`
  );
  return { rows };
};

/**
 *
 * @param {string} table
 * @param {any} where
 */
const deleteDocuments = async (table, where) => {
  const connectionA = db;
  const result = await connectionA.execute(
    `DELETE FROM ${table} ${prepareWhere(where)}`
  );
  return result;
};

module.exports = {
  insert,
  select,
  update,
  deleteDocuments,
};
