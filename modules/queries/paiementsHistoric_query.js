const createHistoric = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO paiementsHistoric 
    (amount, firstname, lastname, email) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllHistoric = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM paiementsHistoric;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOneHistoric = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM paiementsHistoric
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllHistoricByIdentity = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM paiementsHistoric
    WHERE firstname = ? AND lastname = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  createHistoric,
  getAllHistoric,
  getOneHistoric,
  getAllHistoricByIdentity,
};
