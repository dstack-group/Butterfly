export interface FlagError {
  nameFlag: string;
  message: string;
}

export class CommandFlagException extends Error {

  constructor(flagError: FlagError) {
    super(`Invalid flag: ${flagError.nameFlag} | Message: ${flagError.message}`);
    this.name = 'Flag error';
  }
}
