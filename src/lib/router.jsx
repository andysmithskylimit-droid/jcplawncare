import { createContext, useContext, useEffect, useState } from 'react';
import { normalizePath } from '../data/routes';
import { scrollTopImmediate, scrollToTarget } from './motion';

/*
 * A small history-API router. Kept in-house so page changes can run through the
 * striped page transition and so every link stays a real, crawlable <a href>.
 */

const RouterContext = createContext({ path: '/', hash: '', key: 0 });
let navigateImpl = null;
let transitionImpl = null;

export function setTransition(fn) {
  transitionImpl = fn;
}

export function navigate(to, opts = {}) {
  if (navigateImpl) navigateImpl(to, opts);
  else window.location.href = to;
}

const readLocation = () => ({
  path: normalizePath(window.location.pathname),
  hash: window.location.hash.slice(1),
  key: Date.now(),
});

export function RouterProvider({ children }) {
  const [loc, setLoc] = useState(readLocation);

  useEffect(() => {
    const onPop = () => {
      scrollTopImmediate();
      setLoc(readLocation());
    };
    window.addEventListener('popstate', onPop);

    navigateImpl = (to, { replace = false } = {}) => {
      const url = new URL(to, window.location.href);
      const nextPath = normalizePath(url.pathname);
      const hash = url.hash.slice(1);

      if (nextPath === normalizePath(window.location.pathname)) {
        if (hash) {
          window.history.replaceState({}, '', `${url.pathname}${url.hash}`);
          scrollToTarget(`#${hash}`);
        } else {
          scrollToTarget(0);
        }
        return;
      }

      const commit = () => {
        window.history[replace ? 'replaceState' : 'pushState']({}, '', `${url.pathname}${url.hash}`);
        scrollTopImmediate();
        setLoc({ path: nextPath, hash, key: Date.now() });
      };
      if (transitionImpl) transitionImpl(commit, nextPath);
      else commit();
    };

    return () => {
      window.removeEventListener('popstate', onPop);
      navigateImpl = null;
    };
  }, []);

  return <RouterContext.Provider value={loc}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

export function Link({ to, children, onClick, className, ...rest }) {
  const { path } = useRouter();
  const [toPath, toHash] = to.split('#');
  const isCurrent = !toHash && normalizePath(toPath) === path;

  const handle = (e) => {
    onClick && onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target === '_blank') return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handle} className={className} aria-current={isCurrent ? 'page' : undefined} {...rest}>
      {children}
    </a>
  );
}
