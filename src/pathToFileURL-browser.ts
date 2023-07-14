import domainToASCII from "./domainToASCII-browser.js";
import isWindows from "./lib/isWindows.js";
import resolve from "@nodefill/path/resolve.js";

const sep = isWindows.get() ? "\\" : "/";

function encodePathChars(filepath: string): string {
  if (filepath.includes("%")) filepath = filepath.replace(/%/g, "%25");
  // In posix, backslash is a valid character in paths:
  if (!isWindows.get() && filepath.includes("\\")) {
    filepath = filepath.replace(/\\/g, "%5C");
  }
  if (filepath.includes("\n")) {
    filepath = filepath.replace(/\n/g, "%0A");
  }
  if (filepath.includes("\r")) {
    filepath = filepath.replace(/\r/g, "%0D");
  }
  if (filepath.includes("\t")) {
    filepath = filepath.replace(/\t/g, "%09");
  }
  return filepath;
}

function pathToFileURL(filepath: string): URL {
  const outURL = new URL("file://");
  if (isWindows.get() && filepath.startsWith("\\\\")) {
    // UNC path format: \\server\share\resource
    const hostnameEndIndex = filepath.indexOf("\\", 2);
    if (hostnameEndIndex === -1) {
      throw new URIError(`${filepath} missing UNC resource path`);
    }
    if (hostnameEndIndex === 2) {
      throw new URIError(`${filepath} has empty UNC servername`);
    }
    const hostname = filepath.slice(2, hostnameEndIndex);
    outURL.hostname = domainToASCII(hostname);
    outURL.pathname = encodePathChars(
      filepath.slice(hostnameEndIndex).replace(/\\/g, "/")
    );
  } else {
    let resolved = resolve(filepath);
    // path.resolve strips trailing slashes so we must add them back
    const filePathLast = filepath.charCodeAt(filepath.length - 1);
    if (
      (filePathLast === "/".charCodeAt(0) ||
        (isWindows.get() && filePathLast === "\\".charCodeAt(0))) &&
      resolved[resolved.length - 1] !== sep
    ) {
      resolved += "/";
    }
    outURL.pathname = encodePathChars(resolved);
  }
  return outURL;
}

export = pathToFileURL;
