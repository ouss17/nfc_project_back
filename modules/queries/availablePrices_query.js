const createPrice = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO availablePrices 
    (amount, isAvailable) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllPrices = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM availablePrices
    ORDER BY amount ASC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllAvailablePrices = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM availablePrices
    WHERE isAvailable = 1
    ORDER BY amount ASC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updatePrice = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE availablePrices 
    SET amount = ?, isAvailable = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deletePrice = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM availablePrices 
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  createPrice,
  getAllPrices,
  updatePrice,
  deletePrice,
  getAllAvailablePrices,
};
