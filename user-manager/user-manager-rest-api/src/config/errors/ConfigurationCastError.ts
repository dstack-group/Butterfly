export class ConfigurationCastError extends Error {
  constructor(envVariable: string, type: string) {
    const message = `ConfigurationCastError: the variable ${envVariable} should be of type ${type}`;
    super(message);
  }
}
