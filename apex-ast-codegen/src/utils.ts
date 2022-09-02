export function inspect(obj: any) {
  const strLimit = 40;
  console.log(
    JSON.stringify(
      obj,
      (key, val) => {
        if (typeof val === "string" && val.length > strLimit) {
          return `${val.substring(0, strLimit)}...`;
        } else if (key == "loc") {
          return undefined;
        } else {
          return val;
        }
      },
      2
    )
  );
}
