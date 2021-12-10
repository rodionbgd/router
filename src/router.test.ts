import Router from "./router";
import * as listeners from "./listeners";

describe("Testing router", () => {
  let router: ReturnType<typeof Router>;
  let root: HTMLElement;
  let button: HTMLButtonElement;
  let yearInput: HTMLInputElement;
  let showYearParagraph: HTMLParagraphElement;

  beforeAll(() => {
    document.body.innerHTML = `
        <header>
            <nav>
                <a href="/">Home</a>
                <a href="/contacts">Contact</a>
                <a href="/about">About</a>
                <a href="/about/us">About us</a>
            </nav>
        </header>
        <article id="root"></article>
        <section>
            <input type="date" id="year">
            <button id="year-btn">Year</button>
            <p id="show-year"></p>
        </section>
      `;
    root = <HTMLElement>document.getElementById("root");
    button = <HTMLButtonElement>document.getElementById("year-btn");
    yearInput = <HTMLInputElement>document.getElementById("year");
    showYearParagraph = <HTMLParagraphElement>(
      document.getElementById("show-year")
    );

    router = Router();
    router.on(/.*/g, listeners.onEnter);
    router.on((path) => path === "/contacts", listeners.showContact);
    router.on("/about", listeners.onEnter, listeners.onLeave);
    router.on(/year\/*/g, listeners.showYear);
  });

  test("Instantiating Router", () => {
    expect(router.on).toBeTruthy();
    expect(router.go).toBeTruthy();
  });
  test("Adding listeners", () => {
    expect(router.listeners).toHaveLength(4);
  });
  test("Clicking references", () => {
    const goFn = jest.spyOn(router, "go");
    const log = jest.spyOn(console, "log");
    const anchors = document.querySelectorAll("a");
    Array.from(anchors)
      .reverse()
      .forEach((anchor) => {
        router.go(anchor.href);
        if (anchor.href.match(/\/$/) || anchor.href.indexOf("/about") !== -1) {
          expect(root.innerHTML).toBe(
            anchor.href.replace("http://localhost", "")
          );
        } else if (anchor.href.indexOf("/contacts") !== -1) {
          expect(log).toHaveBeenCalledWith("LEAVE");
          expect(root.innerHTML).toBe("Contact");
        }
      });
    expect(goFn).toHaveBeenCalledTimes(anchors.length);
  });
  test("Clicking button", () => {
    yearInput.value = "2021-10-13";
    router.go(`/year/${new Date(yearInput.value).getFullYear()}`);
    expect(showYearParagraph.innerHTML).toBe("Year: 2021");
  });
  test("Unsubscribing", () => {
    const rootInnerHTML = root.innerHTML;
    router.unsubscribe(0);
    router.go("/about/us");
    expect(root.innerHTML).toBe(rootInnerHTML);
  });
});
