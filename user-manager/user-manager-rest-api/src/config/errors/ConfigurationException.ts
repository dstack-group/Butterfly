export abstract class ConfigurationException extends Error {
  constructor(message: string) {
    super(message);
  }
}
