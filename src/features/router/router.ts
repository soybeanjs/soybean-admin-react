import type { RouterNavigateOptions, To } from 'react-router-dom';
import { createBrowserRouter, createHashRouter, matchRoutes } from 'react-router-dom';

import { globalConfig } from '@/config';
import { initCacheRoutes, routes } from '@/router';
import { store } from '@/store';

import { getIsLogin } from '../auth/authStore';

import { initAuthRoutes } from './initRouter';
import { type LocationQueryRaw, stringifyQuery } from './query';
import { setCacheRoutes } from './routeStore';

function initRouter() {
  let isAlreadyPatch = false;

  function getIsNeedPatch(path: string) {
    if (!getIsLogin(store.getState())) return false;

    if (isAlreadyPatch) return false;

    const matchRoute = matchRoutes(routes, { pathname: path }, import.meta.env.VITE_BASE_URL);

    if (!matchRoute) return true;

    if (matchRoute) {
      return matchRoute[1].route.path === '*';
    }

    return false;
  }

  const reactRouter =
    import.meta.env.VITE_ROUTER_HISTORY_MODE === 'hash'
      ? createHashRouter(routes, {
          basename: import.meta.env.VITE_BASE_URL,
          patchRoutesOnNavigation: async ({ patch, path }) => {
            if (getIsNeedPatch(path)) {
              isAlreadyPatch = true;

              await initAuthRoutes(patch);
            }
          }
        })
      : createBrowserRouter(routes, {
          basename: import.meta.env.VITE_BASE_URL,
          patchRoutesOnNavigation: async ({ patch, path }) => {
            if (getIsNeedPatch(path)) {
              isAlreadyPatch = true;

              await initAuthRoutes(patch);
            }
          }
        });

  store.dispatch(setCacheRoutes(initCacheRoutes));

  if (getIsLogin(store.getState()) && !isAlreadyPatch) {
    initAuthRoutes(reactRouter.patchRoutes);

    isAlreadyPatch = true;
  }

  function resetRoutes() {
    isAlreadyPatch = false;
    reactRouter._internalSetRoutes(routes);
  }

  return {
    reactRouter,
    resetRoutes
  };
}

function navigator() {
  const { reactRouter, resetRoutes } = initRouter();

  async function navigate(path: To | null, options?: RouterNavigateOptions) {
    reactRouter.navigate(path, options);
  }

  function back() {
    reactRouter.navigate(-1);
  }

  function forward() {
    reactRouter.navigate(1);
  }

  function go(delta: number) {
    reactRouter.navigate(delta);
  }

  function replace(path: To) {
    reactRouter.navigate(path, { replace: true });
  }

  function reload() {
    reactRouter.navigate(0);
  }

  function navigateUp() {
    reactRouter.navigate('..');
  }

  function goHome() {
    reactRouter.navigate(globalConfig.homePath);
  }

  // eslint-disable-next-line max-params
  function push(path: string, query?: LocationQueryRaw, state?: any, _replace?: boolean) {
    let _path = path;

    if (query) {
      const search = stringifyQuery(query);

      _path = `${path}?${search}`;
    }

    reactRouter.navigate(_path, { replace: _replace, state });
  }

  return {
    back,
    forward,
    go,
    goHome,
    navigate,
    navigateUp,
    push,
    reactRouter,
    reload,
    replace,
    resetRoutes
  };
}

export const router = navigator();

export type RouterContextType = Awaited<ReturnType<typeof navigator>>;
