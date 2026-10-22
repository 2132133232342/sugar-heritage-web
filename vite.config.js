import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' —— 构建产物全部使用相对路径，任意静态服务 / 子目录下均可离线运行。
//
// format: 'iife' —— 把整个应用打成「单个自执行函数」，这是单文件版能稳定运行的关键：
//   ① 产物不再有顶层 let/const 泄漏到全局，作为「经典脚本」内联进单文件 HTML 时
//      不会与全局作用域冲突（此前 ESM 顶层代码内联为经典脚本会让 ECharts 解析失败）；
//   ② 因此单文件版（file:// 双击打开）与目录版行为完全一致。
//   本项目无动态 import、无多入口，故 iife 不会触发代码分割限制。
export default defineConfig({
  base: './',
  plugins: [react()],
  esbuild: {
    keepNames: true
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        format: 'iife'
      }
    }
  }
});
