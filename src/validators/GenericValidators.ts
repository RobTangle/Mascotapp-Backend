// IS VALID URL:
export function isValidURLImage(argumento: any): boolean {
  if (typeof argumento !== "string") {
    return false;
  }
  return (
    argumento.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) !==
    null
  );
}

//IS EMAIL:
export function isEmail(argumento: any): boolean {
  let regex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );
  return regex.test(argumento);
}

// IS STRING:
export function isString(argumento: any): boolean {
  if (typeof argumento !== "string") {
    return false;
  }
  return true;
}

// IS VALID STRING:
export function isValidString(argumento: any): boolean {
  if (typeof argumento === "string" && argumento.length > 0) {
    return true;
  } else {
    return false;
  }
}

// IS EMPTY STRING:
export function isEmptyString(argumento: any): boolean {
  if (typeof argumento === "string" && argumento.length === 0) {
    return true;
  } else {
    return false;
  }
}

// funcion auxiliar para chequear strings y su largo
export function isStringBetween1And101CharsLong(argumento: any): boolean {
  if (
    typeof argumento === "string" &&
    argumento.length >= 1 &&
    argumento.length <= 100
  ) {
    return true;
  }
  return false;
}

export function isStringBetween1And50CharsLong(argumento: any): boolean {
  if (
    typeof argumento === "string" &&
    argumento.length > 0 &&
    argumento.length <= 50
  ) {
    return true;
  } else {
    return false;
  }
}

// is UNDEFINEDorNULL:
export function isUndefinedOrNull(argumento: any): boolean {
  if (argumento === undefined || argumento === null) {
    return true;
  }
  return false;
}

// IS VALID ID
export function isValidId(argumento: any): boolean {
  if (
    typeof argumento === "string" &&
    argumento.length >= 1 &&
    argumento.length <= 50
  ) {
    return true;
  }
  return false;
}

// SANITIZE STRING TO PROTECT HTML CODE
export function sanitize(string: any) {
  const map: any = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match: string | number) => map[match]);
}

export function sanitizeID(string: any) {
  if (typeof string !== "string") {
    console.log(`Error en sanitizeID. El typeof del id no es un string.`);
    throw new Error("El id debe ser un string.");
  }
  if (string.length > 50) {
    console.log("Error en sanitizeID. El string es demasiado largo.");

    throw new Error("El id es demasiado largo.");
  }
  const map: any = {
    "{": "",
    "}": "",
    "<": "",
    ">": "",
    "/": "",
    ".": "",
    ",": "",
    $: "",
    "%": "",
    "(": "",
    ")": "",
    "!": "",
    "|": "",
    "[": "",
    "]": "",
    "´": "",
    "`": "",
    "&": "",
    "'": "",
  };
  const reg = /[&<>'{},.$%()!´`\[\]/]/gi;
  return string.replace(reg, (match: string | number) => map[match]);
}
