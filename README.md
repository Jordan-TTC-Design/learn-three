# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


- .nuxt               // 自動生成的目錄，用於展示結果
- node_modules        // 項目依賴包存放目錄
- .gitignore          // Git的配置目錄，比如一些文件不用Git管理就可以在這個文件中配置
- app.vue             // 項目入口文件，你可以在這里配置路由的出口
- nuxt.config.ts      // nuxt項目的配置文件
- package-lock.json   // 鎖定安裝時包的版本，以保證其他人在 npm install時和你保持一致
- package.json        // 包的配置文件和項目的啟動調式命令配置
- README.md           // 項目的說明文件
- tsconfig.json       // TypeScript的配置文件

-------------常用
- pages               // 開發的頁面目錄
- components          // 組件目錄
- assets              // 靜態資源目錄
- layouts             // 項目布局目錄
--------------

-------------其他
- composables         // nuxt會自動導入vue中的組合式API
- layouts             // nuxt提供了一種可定制的布局框架
- middleware          // nuxt提供了一種可定制的路由中間件框架，可定制路由策略
- plugins             // 插件目錄，nuxt將自動注冊插件
- public              // 網站根目錄
- server              // 服務端路由
- env                 // 全局環境變數
-------------
