export = function domainToASCII(input: string): string {
  const url = new URL("ws://" + Math.random().toString().slice(2));
  const originalHostname = url.hostname;
  url.hostname = input;
  if (url.hostname === originalHostname) {
    return "";
  } else {
    return url.hostname;
  }
};
