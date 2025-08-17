import type { RouteObject } from 'react-router-dom';

function convert(m: any) {
  const { default: Component } = m;

  return {
    Component
  };
}

/**
 * 基础子路由
 *
 * - 关于为什么复用路由需要直接写成react-router的标准格式
 * - 因为每个路由都有自己的loader,action,shouldRevalidate,都是函数
 * - 在后续的通过菜单管理去动态生成路由的时候，函数的编写问题，安全性，性能，可维护性都是问题
 * - 所以需要直接写成react-router的标准格式
 * - 建议复用路由都通过前端自己手动配置去生成(在实际的开发中，复用路由的情况还是很少的)
 * - 所以开发量其实不会很大，其他的约定式都是自动生成并配置的
 */
export const BaseChildrenRoutes = [
  {
    children: [
      {
        handle: {
          i18nKey: 'route.exception_403',
          icon: 'ic:baseline-block',
          title: 'exception_403'
        },
        id: 'exception_403',
        lazy: () => import('@/pages/_builtin/403').then(convert),
        path: '/exception/403'
      },
      {
        handle: {
          i18nKey: 'route.exception_404',
          icon: 'ic:baseline-web-asset-off',
          title: 'exception_404'
        },
        id: 'exception_404',
        lazy: () => import('@/pages/_builtin/404').then(convert),
        path: '/exception/404'
      },
      {
        handle: {
          i18nKey: 'route.exception_500',
          icon: 'ic:baseline-wifi-off',
          title: 'exception_500'
        },
        id: 'exception_500',
        lazy: () => import('@/pages/_builtin/500').then(convert),
        path: '/exception/500'
      }
    ],
    handle: {
      i18nKey: 'route.exception',
      icon: 'ant-design:exception-outlined',
      order: 4,
      title: 'exception'
    },
    id: 'exception',
    path: '/exception'
  },
  {
    children: [
      {
        handle: {
          i18nKey: 'route.document_antd',
          icon: 'logos:ant-design',
          order: 7,
          title: 'document_antd',
          url: 'https://ant.design/index-cn'
        },
        id: 'document_antd',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/antd'
      },
      {
        handle: {
          i18nKey: 'route.document_procomponents',
          icon: 'logos:ant-design',
          order: 8,
          title: 'document_procomponents',
          url: 'https://pro-components.antdigital.dev/'
        },
        id: 'document_procomponents',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/procomponents'
      },
      {
        handle: {
          i18nKey: 'route.document_ui',
          localIcon: 'logo',
          order: 0,
          title: 'document_ui',
          url: 'https://ui-play.skyroc.me/button'
        },
        id: 'document_ui',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/ui'
      },
      {
        handle: {
          i18nKey: 'route.document_project',
          localIcon: 'logo',
          order: 1,
          title: 'document_project',
          url: 'https://react-docs.soybeanjs.cn'
        },
        id: 'document_project',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/project'
      },
      {
        handle: {
          href: 'https://react-docs.soybeanjs.cn',
          i18nKey: 'route.document_project-link',
          localIcon: 'logo',
          order: 2,
          title: 'document_project-link'
        },
        id: 'document_project-link',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/project-link'
      },
      {
        handle: {
          i18nKey: 'route.document_unocss',
          icon: 'logos:unocss',
          order: 5,
          title: 'document_unocss',
          url: 'https://unocss.dev/'
        },
        id: 'document_unocss',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/unocss'
      },
      {
        handle: {
          i18nKey: 'route.document_vite',
          icon: 'logos:vitejs',
          order: 4,
          title: 'document_vite',
          url: 'https://cn.vitejs.dev/'
        },
        id: 'document_vite',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/vite'
      },
      {
        handle: {
          i18nKey: 'route.document_react',
          icon: 'logos:react',
          order: 3,
          title: 'document_react',
          url: 'https://react.dev/'
        },
        id: 'document_react',
        lazy: () => import('@/pages/_builtin/iframe-page').then(convert),
        path: '/document/react'
      }
    ],
    handle: {
      i18nKey: 'route.document',
      icon: 'mdi:file-document-multiple-outline',
      order: 2,
      title: 'document'
    },
    id: 'document',
    path: '/document'
  }
] satisfies RouteObject[];
