/*
 * ServerConfig contains all the settings necessary to make a http request
 */

export interface ServerConfig {
  hostname: string;
  port: number;
  timeout: number;
}
