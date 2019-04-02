import { ConfigurationException } from './ConfigurationException';

export class ConfigurationCastException extends ConfigurationException {
  constructor(property: string, value: string, type: string) {
    const message = `Cannot cast the property ${property} of value ${value} to type ${type}`;
    super(message);
  }
}
