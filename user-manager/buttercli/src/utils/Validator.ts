import { CommandFlagException } from '../exceptions/CommandFlagException';

export class Validator {

  // Every single parameter is already check that is not undefined

  static isStringValid(flag: string, input: string, minLength: number, maxLength: number): string {

    if (input.length < minLength || input.length > maxLength) {
      throw new CommandFlagException({
        message: `Value must be between ${minLength} and ${maxLength} characters`,
        nameFlag: flag,
      });
    }

    return input;
  }

  static isEmailValid(email: string): string {
    const emailRegExp: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.match(emailRegExp) === null) {
      throw new CommandFlagException({
        message: 'The email address is not in a valid format',
        nameFlag: 'email',
      });
    }

    return email;
  }

  static isURLValid(url: string): string {
    const hostRegExp: RegExp = /http[s]?:\/\/[^\s@]+$/;

    if (url.match(hostRegExp) === null) {
      throw new CommandFlagException({
        message: 'The url is not in a valid format',
        nameFlag: '',
      });
    }

    return url;
  }
}
