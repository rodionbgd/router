export function onLeave() {
  // eslint-disable-next-line no-console
  console.log("LEAVE");
}

export function showYear(data: any) {
  if (data.currentPath.indexOf("year") === -1) {
    return;
  }
  document.getElementById("show-year")!.innerHTML = `Year: ${
    data.currentPath.split("/")[2]
  }`;
}

export function showContact() {
  document.getElementById("root")!.innerHTML = "Contact";
}

export function onEnter(data: any) {
  document.getElementById("root")!.innerHTML = data.currentPath;
}
