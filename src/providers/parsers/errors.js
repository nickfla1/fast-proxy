class ParsingError extends Error {
  constructor (message, errors = null) {
    super(message);

    this.errors = errors;
    this.name = "ParsingError";
  }
}

module.exports = { ParsingError };
