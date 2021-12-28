/* eslint-disable @typescript-eslint/naming-convention */
export enum DatabaseType {
  MYSQL = "mysql",
  ORACLE = "oracle",
}

export function getDataBaseTypes(): string[] {
  let types: string[] = [];
  Object.keys(DatabaseType).forEach((key) => {
    types.push(key);
  });
  return types;
}

export function getDataBaseTypeValues(): string[] {
  let types: string[] = [];
  Object.values(DatabaseType).forEach((value) => {
    types.push(value);
  });
  return types;
}

console.log(getDataBaseTypes());
console.log(getDataBaseTypeValues());

console.log(DatabaseType["MYSQL"]);
console.log(<DatabaseType>"MYSQL" === DatabaseType.MYSQL);
console.log(DatabaseType["MYSQL"] === DatabaseType.MYSQL);

console.log(DatabaseType.MYSQL);
