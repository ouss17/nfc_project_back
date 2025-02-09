const createUser = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO utilisateurs 
    (pseudo, email, password, firstname, lastname) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getUserByPseudoOrEmail = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM utilisateurs 
    WHERE email = ? OR pseudo = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deleteUser = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM utilisateurs 
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateUser = (con, values, currentPseudo, pseudo) => {
  return new Promise((resolve, reject) => {
    let query = "";
    switch (true) {
      case currentPseudo == pseudo:
        query = `
    UPDATE utilisateurs 
    SET firstname = ?, lastname = ?
    WHERE id = ?;
    `;
        break;

      default:
        query = `
        UPDATE utilisateurs 
        SET pseudo = ?, firstname = ?, lastname = ?
        WHERE id = ?;
        `;
        break;
    }

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateRole = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE utilisateurs 
    SET role = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updatePassword = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE utilisateurs 
    SET password = ?
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
  createUser,
  getUserByPseudoOrEmail,
  deleteUser,
  updateUser,
  updateRole,
  updatePassword,
};
