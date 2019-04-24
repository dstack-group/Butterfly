export const isValidDate = (dateString?: string) => {
  if (dateString == null) {
    return false;
  }

  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
};
