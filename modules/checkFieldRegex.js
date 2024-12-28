/**
 * Check if date format is valid
 * @param {String} dateString 2024-12-20
 * @returns true||false
 */
function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regex) !== null;
}

/**
 * Check if email format is valid
 * @param {String} email monemail@domaine.com
 * @returns true||false
 */
const isValidEmail = (email) => {
  const emailRegexValidation = /^\S+@\S+\.\S+$/;
  if (!emailRegexValidation.test(email)) {
    return false;
  }
  return true;
};

/**
 * Check if password format is valid according to one of rgpd rules
 * @param {String} password Mypassword123?
 * @returns true||false
 */
const isValidPassword = (password) => {
  const passwordRegexValidation =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

  if (!passwordRegexValidation.test(password)) {
    return false;
  }
  return true;
};

module.exports = { isValidDateFormat, isValidEmail, isValidPassword };
