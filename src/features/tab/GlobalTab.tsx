import { PageTab } from '@sa/materials';
import clsx from 'clsx';

import BetterScroll from '@/components/BetterScroll';
import { getFullContent, toggleFullContent } from '@/layouts/appStore';
import { isPC } from '@/utils/agent';

import { setRemoveCacheKey } from '../router/routeStore';
import { useTheme, useThemeSettings } from '../theme';

import ContextMenu from './TabContextMenu';
import TabReloadButton from './TabReloadButton';
import { useTabActions, useTabManager } from './tabHooks';
import { useTabScroll } from './useTabScroll';

const GlobalTab = () => {
  const { t } = useTranslation();

  const isPCFlag = isPC();

  const { darkMode } = useTheme();

  const themeSettings = useThemeSettings();

  const { activeTabId, dispatch, isTabRetain, navigate, removeTabById, tabs } = useTabActions();

  const { bsWrapper, setBsScroll, tabRef } = useTabScroll(activeTabId);

  useTabManager();

  const fullContent = useAppSelector(getFullContent);

  const tabWrapperClass = themeSettings.tab.mode === 'chrome' ? 'items-end' : 'items-center gap-12px';

  function removeFocus() {
    (document.activeElement as HTMLElement)?.blur();
  }

  function getContextMenuDisabledKeys(tabId: string, index: number) {
    const disabledKeys: App.Global.DropdownKey[] = [];
    const isRetain = isTabRetain(tabId);
    if (isRetain) {
      const homeDisable: App.Global.DropdownKey[] = ['closeCurrent', 'closeLeft'];
      disabledKeys.push(...homeDisable);
    }
    if (index === 1) disabledKeys.push('closeLeft');

    if (index === tabs.length - 1) disabledKeys.push('closeRight');
    return disabledKeys;
  }

  function toggleContent() {
    dispatch(toggleFullContent());
  }

  function handleCloseTab(tab: App.Global.Tab) {
    removeTabById(tab.id);
    dispatch(setRemoveCacheKey(tab.routePath));
  }

  function handleClickTab(tab: App.Global.Tab) {
    navigate(tab.fullPath);
  }

  return (
    <DarkModeContainer className="size-full flex-y-center px-16px shadow-tab">
      <div
        className="h-full flex-1-hidden"
        ref={bsWrapper}
      >
        <BetterScroll
          options={{ click: !isPCFlag, scrollX: true, scrollY: false }}
          setBsScroll={setBsScroll}
          onClick={removeFocus}
        >
          <div
            className={clsx('h-full flex pr-18px', tabWrapperClass)}
            ref={tabRef}
          >
            {tabs.map((item, index) => (
              <ContextMenu
                active={item.id === activeTabId}
                darkMode={darkMode}
                disabledKeys={getContextMenuDisabledKeys(item.id, index)}
                key={item.id}
                mode={themeSettings.tab.mode}
                tabId={item.id}
              >
                <div id={item.id}>
                  <PageTab
                    active={item.id === activeTabId}
                    activeColor={themeSettings.themeColor}
                    closable={!isTabRetain(item.id)}
                    darkMode={darkMode}
                    datatype={item.id}
                    handleClose={() => handleCloseTab(item)}
                    id={item.id}
                    mode={themeSettings.tab.mode}
                    prefix={
                      <SvgIcon
                        className="inline-block align-text-bottom text-16px"
                        icon={item.icon}
                        localIcon={item.localIcon}
                      />
                    }
                    onClick={() => handleClickTab(item)}
                  >
                    <div className="max-w-240px ellipsis-text">{item.i18nKey ? t(item.i18nKey) : item.label}</div>
                  </PageTab>
                </div>
              </ContextMenu>
            ))}
          </div>
        </BetterScroll>
      </div>

      <TabReloadButton />

      <FullScreen
        full={fullContent}
        toggleFullscreen={toggleContent}
      />
    </DarkModeContainer>
  );
};

export default GlobalTab;
