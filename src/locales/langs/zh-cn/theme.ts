const theme: App.I18n.Schema['translation']['theme'] = {
  colourWeakness: '色弱模式',
  configOperation: {
    copyConfig: '复制配置',
    copyFailedMsg: '复制失败',
    copySuccessMsg: '复制成功，请替换 src/theme/settings.ts 中的变量 themeSettings',
    resetConfig: '重置配置',
    resetSuccessMsg: '重置成功'
  },
  fixedHeaderAndTab: '固定头部和标签栏',
  footer: {
    fixed: '固定底部',
    height: '底部高度',
    right: '底部局右',
    visible: '显示底部'
  },
  grayscale: '灰度模式',
  header: {
    breadcrumb: {
      showIcon: '显示面包屑图标',
      visible: '显示面包屑'
    },
    height: '头部高度'
  },
  isOnlyExpandCurrentParentMenu: '仅展开当前父级菜单',
  layoutMode: {
    horizontal: '顶部菜单模式',
    'horizontal-mix': '顶部菜单混合模式',
    reverseHorizontalMix: '一级菜单与子级菜单位置反转',
    title: '布局模式',
    vertical: '左侧菜单模式',
    'vertical-mix': '左侧菜单混合模式'
  },
  page: {
    animate: '页面切换动画',
    mode: {
      fade: '弹动',
      'fade-bottom': '底部消退',
      'fade-scale': '缩放消退',
      'fade-slide': '滑动',
      none: '无',
      title: '页面切换动画类型',
      'zoom-fade': '渐变',
      'zoom-out': '闪现'
    }
  },
  pageFunTitle: '页面功能',
  recommendColor: '应用推荐算法的颜色',
  recommendColorDesc: '推荐颜色的算法参照',
  scrollMode: {
    content: '主体滚动',
    title: '滚动模式',
    wrapper: '外层滚动'
  },
  sider: {
    collapsedWidth: '侧边栏折叠宽度',
    inverted: '深色侧边栏',
    mixChildMenuWidth: '混合布局子菜单宽度',
    mixCollapsedWidth: '混合布局侧边栏折叠宽度',
    mixWidth: '混合布局侧边栏宽度',
    width: '侧边栏宽度'
  },
  tab: {
    cache: '缓存标签页',
    height: '标签栏高度',
    mode: {
      button: '按钮风格',
      chrome: '谷歌风格',
      title: '标签栏风格'
    },
    visible: '显示标签栏'
  },
  themeColor: {
    error: '错误色',
    followPrimary: '跟随主色',
    info: '信息色',
    primary: '主色',
    success: '成功色',
    title: '主题颜色',
    warning: '警告色'
  },
  themeDrawerTitle: '主题配置',
  themeSchema: {
    title: '主题模式'
  },
  watermark: {
    text: '水印文本',
    visible: '显示全屏水印'
  }
};

export default theme;
