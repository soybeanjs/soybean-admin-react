import { RouterProvider } from '@sa/simple-router';
import { useUpdateEffect } from 'ahooks';
import type { WatermarkProps } from 'antd';

import { info } from '@/constants/app';
import { router } from '@/router';
import { getLocale } from '@/store/slice/app';
import { getDarkMode, getThemeSettings, themeColors } from '@/store/slice/theme';
import { getAntdTheme, setupThemeVarsToHtml, toggleCssDarkMode } from '@/store/slice/theme/shared';
import { localStg } from '@/utils/storage';

import AppProvider from './components/stateful/AppProvider';
import { antdLocales } from './locales/antd';
import { getIsInitConstantRoute } from './store/slice/route';

const watermarkProps: WatermarkProps = {
  font: {
    fontSize: 16
  },
  height: 128,
  offset: [12, 60],
  rotate: -15,
  width: 240,
  zIndex: 9999
};

function useTheme() {
  const themeSettings = useAppSelector(getThemeSettings);
  const colors = useAppSelector(themeColors);

  const darkMode = useAppSelector(getDarkMode);
  const antdTheme = getAntdTheme(colors, darkMode, themeSettings.tokens);

  useEffect(() => {
    setupThemeVarsToHtml(colors, themeSettings.tokens, themeSettings.recommendColor);
    localStg.set('themeColor', colors.primary);
  }, [colors, themeSettings]);

  useUpdateEffect(() => {
    toggleCssDarkMode(darkMode);
  }, [darkMode]);

  console.info(`%c${info}`, `color: ${colors.primary}`);

  return { antdTheme, themeSettings };
}

const App = () => {
  const locale = useAppSelector(getLocale);

  const initAuthRoute = useAppSelector(getIsInitConstantRoute);

  const { antdTheme, themeSettings } = useTheme();

  if (!initAuthRoute) return <GlobalLoading />;

  return (
    <AConfigProvider
      button={{ classNames: { icon: 'align-1px  text-icon' } }}
      card={{ styles: { body: { flex: 1, overflow: 'hidden', padding: '12px 16px ' } } }}
      locale={antdLocales[locale]}
      theme={antdTheme}
    >
      <AppProvider>
        <AWatermark
          className="h-full"
          content={themeSettings.watermark.visible ? themeSettings.watermark?.text || 'Soybean' : ''}
          {...watermarkProps}
        >
          <RouterProvider
            fallback={<GlobalLoading />}
            router={router}
          />
        </AWatermark>
      </AppProvider>
    </AConfigProvider>
  );
};

export default App;
