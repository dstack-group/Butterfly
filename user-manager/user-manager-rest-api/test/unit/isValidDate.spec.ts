import { isValidDate } from '../isValidDate';

describe(`isValidDate should return false when provided an invalid date`, () => {
  it(`isValidDate should return false when it receives an undefined value`, () => {
    expect(false).toEqual(isValidDate(undefined));
  });

  it(`isValidDate should return false when it receives an invalid date`, () => {
    expect(false).toEqual(isValidDate('invalid_date'));
  });
});
