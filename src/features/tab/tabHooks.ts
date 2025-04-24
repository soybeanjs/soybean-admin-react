import { useEmit, useOn } from '@sa/hooks';

import { useRoute, useRouter } from '@/features/router';
import { setRemoveCacheKey } from '@/features/router/routeStore';
import {
  addTab,
  changeTabLabel,
  selectActiveTabId,
  selectTabs,
  setActiveFirstLevelMenuKey,
  setActiveTabId,
  setTabs,
  updateTab
} from '@/features/tab/tabStore';
import { localStg } from '@/utils/storage';

import { getActiveFirstLevelMenuKey } from '../menu/MenuUtil';
import { useThemeSettings } from '../theme';

import { filterTabsById, filterTabsByIds, getFixedTabs, getTabByRoute, isTabInTabs } from './shared';
import { TabEvent } from './tabEnum';

export function useUpdateTabs() {
  const dispatch = useAppDispatch();

  /**
   * 更新标签页
   *
   * @param newTabs
   */
  function updateTabs(newTabs: App.Global.Tab[]) {
    dispatch(setTabs(newTabs));
  }

  return updateTabs;
}

export function useTabActions() {
  const dispatch = useAppDispatch();

  const tabs = useAppSelector(selectTabs);

  const _fixedTabs = getFixedTabs(tabs);

  const updateTabs = useUpdateTabs();

  const _tabIds = tabs.map(tab => tab.id);

  const { navigate } = useRouter();

  const activeTabId = useAppSelector(selectActiveTabId);

  /**
   * 切换激活的标签页
   *
   * @param tabId
   */
  function changeActiveTabId(tabId: string) {
    dispatch(setActiveTabId(tabId));
  }

  /**
   * 根据标签页切换路由
   *
   * @param tab
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    navigate(tab.fullPath);

    changeActiveTabId(tab.id);
  }

  /**
   * 清除标签页
   *
   * @param excludes
   */
  function _clearTabs(excludes: string[] = []) {
    const remainTabIds = [..._fixedTabs.map(tab => tab.id), ...excludes];

    const removedTabsIds = _tabIds.filter(id => !remainTabIds.includes(id));

    const isRemoveActiveTab = removedTabsIds.includes(activeTabId);

    const updatedTabs = filterTabsByIds(removedTabsIds, tabs);

    if (!isRemoveActiveTab) {
      updateTabs(updatedTabs);
    } else {
      const activeTab = updatedTabs.at(-1);

      if (activeTab) {
        switchRouteByTab(activeTab);

        updateTabs(updatedTabs);
      }
    }
  }

  /**
   * 清除左侧标签页
   *
   * @param tabId
   */
  function _clearLeftTabs(tabId: string) {
    const index = _tabIds.indexOf(tabId);

    if (index === -1) return;

    const excludes = _tabIds.slice(index);

    _clearTabs(excludes);
  }

  /**
   * 清除右侧标签页
   *
   * @param tabId
   */
  function _clearRightTabs(tabId: string) {
    const index = _tabIds.indexOf(tabId);

    if (index === 0) {
      _clearTabs();
      return;
    }

    if (index === -1) return;

    const excludes = _tabIds.slice(0, index + 1);

    _clearTabs(excludes);
  }

  /**
   * 删除标签页
   *
   * @param tabId
   */
  function removeTabById(tabId: string) {
    const isRemoveActiveTab = activeTabId === tabId;

    const updatedTabs = filterTabsById(tabId, tabs);

    if (!isRemoveActiveTab) {
      // 如果删除的不是激活的标签页，则更新标签页
      updateTabs(updatedTabs);
    } else {
      // 如果删除的是激活的标签页，则切换到最后一个标签页或者首页标签页
      const activeTab = updatedTabs.at(-1);

      if (activeTab) {
        switchRouteByTab(activeTab);

        updateTabs(updatedTabs);
      }
    }
  }

  function removeActiveTab() {
    removeTabById(activeTabId);
  }

  /**
   * 判断标签页是否保留
   *
   * @param tabId
   * @returns
   */
  function isTabRetain(tabId: string) {
    return _fixedTabs.some(tab => tab.id === tabId);
  }

  useOn(TabEvent.UPDATE_TABS, (eventName: TabEvent, id: string) => {
    // 清除左侧标签页
    if (eventName === TabEvent.CLEAR_LEFT_TABS) return _clearLeftTabs(id);

    // 清除右侧标签页
    if (eventName === TabEvent.CLEAR_RIGHT_TABS) return _clearRightTabs(id);

    // 关闭当前标签页
    if (eventName === TabEvent.CLOSE_CURRENT) return removeTabById(id);

    // 关闭其他标签页
    if (eventName === TabEvent.CLOSE_OTHER) return _clearTabs([id]);

    // 清除所有标签页
    return _clearTabs();
  });

  return {
    activeTabId,
    dispatch,
    isTabRetain,
    navigate,
    removeActiveTab,
    removeTabById,
    tabs
  };
}

export function useTabController() {
  const emit = useEmit();
  const dispatch = useAppDispatch();
  const tabs = useAppSelector(selectTabs);

  function _operateTab(eventName: TabEvent, id?: string) {
    emit(TabEvent.UPDATE_TABS, eventName, id);
  }

  function _getTabRoutePaths(id: string, eventName: TabEvent): string[] {
    const routePaths: string[] = [];

    if (eventName === TabEvent.CLOSE_CURRENT) {
      // 关闭单个标签时
      const tab = tabs.find(tabItem => tabItem.id === id);
      if (tab?.routePath) {
        routePaths.push(tab.routePath);
      }
    } else if (eventName === TabEvent.CLEAR_LEFT_TABS) {
      // 关闭左侧标签时
      const index = tabs.findIndex(tabItem => tabItem.id === id);
      if (index > 0) {
        tabs.slice(0, index).forEach(tabItem => {
          if (tabItem.routePath && !tabItem.fixedIndex && tabItem.fixedIndex !== 0) {
            routePaths.push(tabItem.routePath);
          }
        });
      }
    } else if (eventName === TabEvent.CLEAR_RIGHT_TABS) {
      // 关闭右侧标签时
      const index = tabs.findIndex(tabItem => tabItem.id === id);
      if (index !== -1 && index < tabs.length - 1) {
        tabs.slice(index + 1).forEach(tabItem => {
          if (tabItem.routePath && !tabItem.fixedIndex && tabItem.fixedIndex !== 0) {
            routePaths.push(tabItem.routePath);
          }
        });
      }
    } else if (eventName === TabEvent.CLOSE_OTHER) {
      // 关闭其他标签时
      tabs.forEach(tabItem => {
        if (tabItem.id !== id && tabItem.routePath && !tabItem.fixedIndex && tabItem.fixedIndex !== 0) {
          routePaths.push(tabItem.routePath);
        }
      });
    } else if (eventName === TabEvent.CLOSE_ALL) {
      // 关闭所有标签时
      tabs.forEach(tabItem => {
        if (tabItem.routePath && !tabItem.fixedIndex && tabItem.fixedIndex !== 0) {
          routePaths.push(tabItem.routePath);
        }
      });
    }

    return routePaths;
  }

  function _clearTabsCache(id: string, eventName: TabEvent) {
    const routePaths = _getTabRoutePaths(id, eventName);

    // 串行处理所有需要删除的缓存，确保每个缓存都被正确清理
    if (routePaths.length > 0) {
      let promise = Promise.resolve();

      routePaths.forEach(path => {
        promise = promise.then(() => {
          return new Promise<void>(resolve => {
            dispatch(setRemoveCacheKey(path));
            setTimeout(resolve, 50);
          });
        });
      });
    }
  }

  function clearLeftTabs(id: string) {
    _clearTabsCache(id, TabEvent.CLEAR_LEFT_TABS);
    _operateTab(TabEvent.CLEAR_LEFT_TABS, id);
  }

  function clearRightTabs(id: string) {
    _clearTabsCache(id, TabEvent.CLEAR_RIGHT_TABS);
    _operateTab(TabEvent.CLEAR_RIGHT_TABS, id);
  }

  function closeCurrentTab(id: string) {
    _clearTabsCache(id, TabEvent.CLOSE_CURRENT);
    _operateTab(TabEvent.CLOSE_CURRENT, id);
  }

  function closeOtherTabs(id: string) {
    _clearTabsCache(id, TabEvent.CLOSE_OTHER);
    _operateTab(TabEvent.CLOSE_OTHER, id);
  }

  function closeAllTabs() {
    _clearTabsCache('', TabEvent.CLOSE_ALL);
    _operateTab(TabEvent.CLOSE_ALL);
  }

  return {
    clearLeftTabs,
    clearRightTabs,
    closeAllTabs,
    closeCurrentTab,
    closeOtherTabs
  };
}

export function initTab(cache: boolean, updateTabs: (tabs: App.Global.Tab[]) => void) {
  const storageTabs = localStg.get('globalTabs');

  if (cache && storageTabs) {
    // const tabs = extractTabsByAllRoutes(router.getAllRouteNames(), storageTabs);
    // dispatch(setTabs(tabs));
    updateTabs(storageTabs);
    return storageTabs;
  }

  return [];
}

export function useCacheTabs() {
  const themeSettings = useThemeSettings();

  const tabs = useAppSelector(selectTabs);

  function cacheTabs() {
    if (!themeSettings.tab.cache) return;

    localStg.set('globalTabs', tabs);
  }

  return cacheTabs;
}

export function useTabManager() {
  const isInit = useRef(false);

  const themeSettings = useThemeSettings();

  const cacheTabs = useCacheTabs();

  const tabs = useAppSelector(selectTabs);

  const dispatch = useAppDispatch();

  const _route = useRoute();

  const updateTabs = useUpdateTabs();

  function _addTab(route: Router.Route) {
    const tab = getTabByRoute(route);

    if (!isInit.current) {
      isInit.current = true;

      const initTabs = initTab(themeSettings.tab.cache, updateTabs);

      if (!initTabs || initTabs.length === 0 || (initTabs.length > 0 && !isTabInTabs(tab.id, initTabs))) {
        dispatch(addTab(tab));
      }
    } else if (!isTabInTabs(tab.id, tabs)) {
      dispatch(addTab(tab));
    } else {
      const index = tabs.findIndex(item => item.id === tab.id);

      dispatch(updateTab({ index, tab }));
    }

    dispatch(setActiveTabId(tab.id));

    const firstLevelRouteName = getActiveFirstLevelMenuKey(route);
    dispatch(setActiveFirstLevelMenuKey(firstLevelRouteName));
  }

  useEffect(() => {
    _addTab(_route);
  }, [_route.fullPath]);

  useEventListener(
    'beforeunload',
    () => {
      cacheTabs();
    },
    { target: window }
  );
}

export function useTabLabel() {
  const dispatch = useAppDispatch();

  const activeTabId = useAppSelector(selectActiveTabId);

  const tabs = useAppSelector(selectTabs);

  function setTabLabel(label: string, tabId?: string) {
    const id = tabId || activeTabId;

    const tab = tabs.findIndex(item => item.id === id);

    if (tab < 0) return;

    dispatch(changeTabLabel({ index: tab, label }));
  }

  function resetTabLabel(tabId?: string) {
    const id = tabId || activeTabId;

    const tab = tabs.findIndex(item => item.id === id);

    if (tab < 0) return;

    dispatch(changeTabLabel({ index: tab }));
  }

  return {
    resetTabLabel,
    setTabLabel
  };
}
