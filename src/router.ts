import { Listener, Match } from "./types";

export default function Router() {
  let listeners: Listener[] = [];
  let currentPath = "/";
  let prevPath = "";
  let listenerId = 0;

  function isMatch(match: Match, path: string) {
    return !!(
      (match instanceof RegExp && match.test(path)) ||
      (typeof match === "function" && match(path)) ||
      match === path
    );
  }

  function handleListener({ match, onEnter, onLeave }: Listener) {
    const data = {
      currentPath: window.location.pathname,
      prevPath,
      state: window.history.state,
      onLeave,
    };

    if (currentPath === prevPath) {
      return;
    }

    if (isMatch(match, currentPath)) {
      onEnter(data);
    }
    if (isMatch(match, prevPath)) {
      if (onLeave) {
        onLeave(data);
      }
    }
  }

  const on = function on(match: Match, onEnter: any, onLeave?: any) {
    const currentListenerId = listenerId;
    const listener: Listener = {
      id: currentListenerId,
      match,
      onEnter,
      onLeave,
    };
    listenerId += 1;
    listeners.push(listener);
    handleListener(listener);
    return currentListenerId;
  };

  function handleListeners() {
    listeners.forEach((listener) => {
      handleListener(listener);
    });
  }

  const unsubscribe = (id: number) => {
    listeners = listeners.filter((val) => val.id !== id);
  };

  const go = function go(url: string, state?: any) {
    prevPath = currentPath;
    window.history.pushState(state, "", url);
    currentPath = window.location.pathname;
    handleListeners();
  };

  window.addEventListener("popstate", handleListeners);

  return { on, go, unsubscribe, listeners };
}
