let cache: boolean;
export = {
  // @ts-ignore
  get: () => (cache ??= navigator.userAgentData?.platform === "Windows"),
};
