class AppError extends Error {
  /**
   * @param {string} message       
   * @param {number} statusCode    
   * @param {string} errorCode     
   */
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode    = statusCode;
    this.errorCode     = errorCode;
    this.isOperational = true; 

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;