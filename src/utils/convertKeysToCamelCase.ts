export default function convertKeysToCamelCase(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  }

  return Object.keys(obj).reduce((result: any, key: string) => {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    const value = obj[key];
    result[camelCaseKey] = convertKeysToCamelCase(value);
    return result;
  }, {});
}
