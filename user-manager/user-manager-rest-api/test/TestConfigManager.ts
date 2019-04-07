import { AbstractConfigManager } from '../src/config';

export class TestConfigManager extends AbstractConfigManager {
  private configMap = new Map<string, string>();

  protected readConfigValue(property: string): string | undefined {
    return this.configMap.get(property);
  }

  setProperty(property: string, value: string) {
    this.configMap.set(property, value);
  }
}
