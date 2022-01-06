export function clsnm(...classNames) {
  let className = "";

  for (let i = 0; i < classNames?.length; i++) {
    if (classNames[i] && classNames[i] !== true) {
      className += `${classNames[i]}${i === classNames?.length - 1 ? "" : " "}`;
    }
  }

  return className;
}
