import { ConfigurationException } from './ConfigurationException';

export class ConfigurationUndefinedException extends ConfigurationException {
  constructor(property: string) {
    const message = `The property ${property} is null, but it should have at least a default value.`;
    super(message);
  }
}
