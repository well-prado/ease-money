export function isTokenExpired(token: string): boolean {
  const decoded = decode(token) as { exp: number };

  function decode(token: string): string | object {
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Token structure incorrect");
    }

    const decoded = urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error("Cannot decode the token");
    }

    return JSON.parse(decoded);
  }

  function urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw "Illegal base64url string!";
    }

    return decodeURIComponent(
      atob(output)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }
  return decoded.exp < Date.now() / 1000;
}
