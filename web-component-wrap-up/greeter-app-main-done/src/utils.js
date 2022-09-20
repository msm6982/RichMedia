const defaultName = "Mr. X";

export const formatGreeting = (greeting, name, forcefully) => {
  const recipient  = name || defaultName;
  const str = `${greeting} ${recipient}`;
  return forcefully ? `${str.toUpperCase()}!` : str;
};