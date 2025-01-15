import type { HttpProxy, ProxyOptions } from 'vite';

import { createServiceConfig } from '../../src/utils/service';

import { clearScreen, createColors } from './cli-helper';

const colors = createColors();
/**
 * Set http proxy
 *
 * @param env - The current env
 * @param enable - If enable http proxy
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  if (!isEnableHttpProxy) return undefined;

  const { baseURL, other, proxyPattern } = createServiceConfig(env);

  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, proxyPattern });

  other.forEach(item => {
    Object.assign(proxy, createProxyItem(item));
  });

  return proxy;
}

function createProxyItem(item: App.Service.ServiceConfigItem) {
  const proxy: Record<string, ProxyOptions> = {};

  proxy[item.proxyPattern] = {
    changeOrigin: true,
    configure: (_proxy: HttpProxy.Server, options: ProxyOptions) => {
      _proxy.on('proxyReq', (_proxyReq, req, _res) => {
        clearScreen();
        // eslint-disable-next-line no-console
        console.log(colors.bgYellow(`  ${req.method}  `), colors.green(`${options.target}${req.url}`));
      });
      _proxy.on('error', (_err, req, _res) => {
        // eslint-disable-next-line no-console
        console.log(colors.bgRed(`Error：${req.method}  `), colors.green(`${options.target}${req.url}`));
      });
    },
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), ''),
    target: item.baseURL
  };

  return proxy;
}
