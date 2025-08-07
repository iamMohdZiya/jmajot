const { validateToken } = require('../service/authentication');

/**
 * Checks for an authentication cookie and validates the token.
 * If the token is invalid or the user's role is not in the list of valid roles,
 * it clears the cookie and returns an error response.
 * If the token is valid, it sets the user payload on the request object and calls the next middleware.
 *
 * @param {string} cookieName - The name of the cookie to check for.
 * @param {string[]} [validRoles=[]] - An optional list of valid roles.
 * @returns {Function} An Express middleware function.
 */
function checkForAthenticationCookie(cookieName, validRoles = []) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log('No token cookie found');
      return res.status(401).send('Authentication required');
    }
    try {
      const userPayload = await validateToken(tokenCookieValue);
      if (!userPayload) {
        console.error('No user payload returned from validateToken');
        res.clearCookie(cookieName);
        return res.status(401).send('Invalid token');
      }

      // Normalize role for case-insensitive comparison
      const userRole = userPayload.role?.toLowerCase();
      const normalizedValidRoles = validRoles.map(role => role.toLowerCase());

      if (validRoles.length > 0 && !normalizedValidRoles.includes(userRole)) {
        console.error(`Invalid role: ${userPayload.role}`);
        res.clearCookie(cookieName);
        return res.status(403).send('Forbidden: Invalid role');
      }

      req.user = userPayload;
      console.log(`Authenticated user: ${userPayload._id} (${userPayload.role})`);
      next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.clearCookie(cookieName);
      next();
    }
  };
}

module.exports = {
  checkForAthenticationCookie,
  validateToken
};