import boxen, { type Options as BoxenOptions } from 'boxen';
import gradientString from 'gradient-string';
import type { Plugin } from 'vite';

const welcomeMessage = gradientString('#646cff', 'magenta').multiline(
  `您好! 欢迎使用 react-soybean 开源项目\n我们为您精心准备了精美的保姆级文档\nhttps://react-docs.soybeanjs.cn/`
);

const boxenOptions: BoxenOptions = {
  borderColor: '#646cff',
  borderStyle: 'round',
  padding: 0.5
};

export function setupProjectInfo(): Plugin {
  return {
    buildStart() {
      console.log(boxen(welcomeMessage, boxenOptions));
    },

    name: 'vite:buildInfo'
  };
}
