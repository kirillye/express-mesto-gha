class NotFound extends Error {
  constructor(message) {
    super(message || "не найдено...");
    this.statusCode = 404;
  }
}

module.exports = NotFound;
