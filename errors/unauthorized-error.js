class Unauthorized extends Error {
  constructor(message) {
    super(message || "Unauthorized");
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
