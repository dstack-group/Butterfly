export class ConfigurationError extends Error {
  constructor(envVariable: string) {
    const message = `ConfigurationError: the variable ${envVariable} shouldn't be undefined`;
    super(message);
  }
}
