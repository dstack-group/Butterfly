export class Validator {

    // Every single parameter is already check that is not undefined

    static isStringValid(input: string, minLength: number, maxLength: number): boolean {

        return input.length >= minLength && input.length <= maxLength;
    }

    static isEmailValid(email: string): boolean {
        const emailRegExp: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.match(emailRegExp) === null) {
            return false;
        }

        return true;
    }

    static isHostnameValid(hostname: string): boolean {
        // TODO: Find a regexp for the hostname check
        /*
        const hostRegExp: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (hostname.match(hostRegExp) === null) {
            return false;
        }
        */

        return true;
    }
}
