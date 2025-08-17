/* eslint-disable class-methods-use-this */
import type { WatermarkProps } from 'antd';

import { themeSettings } from './theme/settings';
import { isPC } from './utils/agent';
import { getServiceBaseURL } from './utils/service';

const isDev = import.meta.env.DEV;

const isHttpProxy = isDev && import.meta.env.VITE_HTTP_PROXY === 'Y';

const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

class GlobalConfig {
  /** - 默认暗色模式 */
  private _defaultDarkMode = false;

  /** - 默认语言 */
  private _defaultLang: App.I18n.LangType = 'zh-CN';

  /** - 默认语言选项 */
  private _defaultLangOptions: App.I18n.LangOption[] = [
    {
      key: 'zh-CN',
      label: '中文'
    },
    {
      key: 'en-US',
      label: 'English'
    }
  ];

  /** - 首页路径 */
  private _homePath = import.meta.env.VITE_ROUTE_HOME;

  /** - 默认主题颜色 */
  private _defaultThemeColor = themeSettings.themeColor;

  /** - 是否开发环境 */
  private _isDev = isDev;

  /** - 服务基础URL */
  private _serviceBaseURL = baseURL;

  /** - 服务其他基础URL */
  private _serviceOtherBaseURL = otherBaseURL;

  /** - 空函数 */
  private _noop = () => {};

  /** - 水印文本 */
  private _watermarkText = 'Soybean';

  /** - 水印配置 */
  private _watermarkConfig = {
    font: {
      fontSize: 16
    },
    height: 128,
    offset: [12, 60],
    rotate: -15,
    width: 240,
    zIndex: 9999
  } satisfies WatermarkProps;

  /** - 图标本地前缀 */
  private _iconLocalPrefix = import.meta.env.VITE_ICON_LOCAL_PREFIX;

  /** - 是否PC */
  private _isPC = isPC();

  /** - 默认暗色模式 */
  get defaultDarkMode() {
    return this._defaultDarkMode;
  }

  /** - 设置默认暗色模式 */
  set defaultDarkMode(darkMode: boolean) {
    this._defaultDarkMode = darkMode;
  }

  /** - 默认语言 */
  get defaultLang() {
    return this._defaultLang;
  }

  /** - 设置默认语言 */
  set defaultLang(lang: App.I18n.LangType) {
    this._defaultLang = lang;
  }

  /** - 默认语言选项 */
  get defaultLangOptions() {
    return this._defaultLangOptions;
  }

  /** - 默认主题颜色 */
  get defaultThemeColor() {
    return this._defaultThemeColor;
  }

  /** - 设置默认主题颜色 */
  set defaultThemeColor(themeColor: string) {
    this._defaultThemeColor = themeColor;
  }

  /** - 是否开发环境 */
  get isDev() {
    return this._isDev;
  }

  /** - 空函数 */
  get noop() {
    return this._noop;
  }

  /** - 水印配置 */
  get watermarkConfig() {
    return this._watermarkConfig;
  }

  /** - 水印文本 */
  get watermarkText() {
    return this._watermarkText;
  }

  /** - 首页路径 */
  get homePath() {
    return this._homePath;
  }

  /** - 图标本地前缀 */
  get localIconPrefix() {
    return this._iconLocalPrefix;
  }

  /** - 是否PC */
  get isPC() {
    return this._isPC;
  }

  /** - 服务基础URL */
  get serviceBaseURL() {
    return this._serviceBaseURL;
  }

  /** - 服务其他基础URL */
  get serviceOtherBaseURL() {
    return this._serviceOtherBaseURL;
  }
}

export const globalConfig = new GlobalConfig();
