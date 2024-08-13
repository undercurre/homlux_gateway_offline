# 美的商照后台管理系统

## 简介

基于`Soybean Admin`后台模板开发

## 参考文档

- [Soybean Admin文档（旧版）](https://legacy-docs.soybeanjs.cn/guide/introduction.html)

- [Vue3 文档](https://cn.vuejs.org/)

- [Vue Router](https://router.vuejs.org/zh/)

- [NaiveUI](https://www.naiveui.com/zh-CN/os-theme)

- [Vite 官方中文文档](https://cn.vitejs.dev/)

- [Pinia](https://pinia.vuejs.org/zh/)

- [axios](https://axios-http.com/zh/docs/intro)

- [Tailwind文档](https://tailwindcss.com/)

## npm scripts

```json
{
  // 本地运行(dev环境)
  "dev": "cross-env VITE_ENV_TYPE=dev vite",
  // 本地运行(test环境)
  "dev:test": "cross-env VITE_HTTP_ENV=test vite",
  // 本地运行(prod环境)
  "dev:prod": "cross-env VITE_HTTP_ENV=prod vite",
  // 构建打包(prod环境)
  "build": "npm run typecheck && cross-env VITE_HTTP_ENV=prod vite build",
  // 构建打包(dev环境)
  "build:dev": "npm run typecheck && cross-env VITE_HTTP_ENV=dev vite build",
  // 构建打包(test环境)
  "build:test": "npm run typecheck && cross-env VITE_HTTP_ENV=test vite build",
  // 构建打包(部署vercel)
  "build:vercel": "cross-env VITE_HASH_ROUTE=true vite build",
  // 本地环境预览构建后的dist
  "preview": "vite preview",
  // vue文件的ts检查
  "typecheck": "vue-tsc --noEmit --skipLibCheck",
  // 检测代码是否符合eslint规范并自动修复
  "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix",
  // 初始化husky
  "prepare": "husky install"
}
```

## 目录说明

```
soybean-admin
├── .vscode                        //vscode插件和设置
│   ├── extensions.json            //vscode推荐的插件
│   ├── launch.json                //debug配置文件
│   └── settings.json              //vscode配置(在该项目中生效，可以复制到用户配置文件中)
├── build                          //vite构建相关配置和插件
│   ├── config                     //构建打包配置
│   │   ├── define.ts              //定义的全局常量，通过vite构建时注入
│   │   └── proxy.ts               //网络请求代理
│   ├── plugins                    //构建插件
│   │   ├── compress.ts            //代码压缩插件
│   │   ├── html.ts                //html插件(注入变量，压缩代码等)
│   │   ├── index.ts               //插件汇总
│   │   ├── mock.ts                //mock插件
│   │   ├── pwa.ts                 //PWA应用插件
│   │   ├── unplugin.ts            //自动导入UI组件、自动解析iconify图标、自动解析本地svg作为图标
│   │   └── visualizer.ts          //构建的依赖大小占比分析插件
│   └── utils                      //构建相关工具函数
├── docker                         //docker相关配置
├── mock                           //mock
│   ├── api                        //mock的接口
│   └── model                      //mock的数据
├── patches                        //修改的node_modules依赖的补丁文件
├── public                         //公共目录(文件夹里面的资源打包后会在根目录下)
│   ├── favicon.svg                //网站标签图标
│   └── logo.png                   //系统logo
├── src
│   ├── assets                     //静态资源
│   │   ├── svg-icon               //本地svg图标
│   │   └── fonts                  //字体
│   ├── components                 //全局组件
│   │   ├── business               //业务相关组件
│   │   ├── common                 //公共组件
│   │   └── custom                 //自定义组件
│   ├── composables                //组合式函数(从外部引入状态+内部状态)
│   │   ├── echarts.ts             //echarts相关
│   │   ├── events.ts              //事件相关
│   │   ├── icon.ts                //图标渲染
│   │   ├── layout.ts              //布局相关
│   │   ├── router.ts              //路由相关
│   │   └── system.ts              //系统相关
│   ├── config                     //全局常量配置
│   │   ├── map-sdk.ts             //地图插件的sdk配置
│   │   ├── regexp.ts              //常用正则
│   │   └── service.ts             //请求相关配置
│   ├── constants                  //常量声明
│   ├── context                    //上下文状态
│   │   └── demo.ts                //上下文状态示例写法
│   ├── directives                 //vue指令
│   │   ├── login.ts               //登录指令
│   │   ├── network.ts             //网络检测指令
│   │   └── permission.ts          //权限指令
│   ├── hooks                      //组合式的函数hooks(状态从函数里面产生)
│   │   ├── business               //业务相关hooks
│   │   │   ├── use-count-down     //倒计时
│   │   │   ├── use-image-verify   //图片验证那
│   │   │   ├── use-table          //表格
│   │   │   └── use-sms-code       //短信验证码
│   │   └── common                 //通用hooks
│   │       ├── use-boolean        //boolean
│   │       ├── use-context        //上下文(provide、inject)
│   │       ├── use-loading        //加载
│   │       ├── use-loading-empty  //加载和空状态
│   │       └── use-reload         //重载
│   ├── layouts                    //布局组件
│   │   ├── basic-layout           //基本布局(包含全局头部、多页签、侧边栏、底部等公共部分)
│   │   ├── blank-layout           //空白布局组件(单个页面)
│   │   └── common                 //全局头部、多页签、侧边栏、底部等公共部分组件
│   │       ├── global-back-top    //全局回到顶部
│   │       ├── global-content     //全局主体内容
│   │       ├── global-footer      //全局底部
│   │       ├── global-header      //全局头部
│   │       ├── global-logo        //全局Logo
│   │       ├── global-search      //全局搜索
│   │       ├── global-sider       //全局侧边栏
│   │       ├── global-tab         //全局标签页
│   │       └── setting-drawer     //项目配置抽屉
│   ├── locales                //国际化配置
│   ├── plugins                //插件
│   │   └── assets.ts          //各种依赖的静态资源导入(css、scss等)
│   ├── router                 //vue路由
│   │   ├── guard              //路由守卫
│   │   ├── helpers            //路由相关的辅助函数
│   │   ├── modules            //静态(static)模式的路由数据
│   │   └── routes             //声明的固定路由
│   ├── service                //网络请求
│   │   ├── api                //接口api
│   │   └── request            //封装的请求函数
│   ├── settings               //项目初始配置
│   │   ├── color.ts           //传统颜色相关信息
│   │   └── theme.ts           //项目主题初始配置
│   ├── store                  //pinia状态管理
│   │   ├── modules            //状态管理划分的模块
│   │   │   ├── app            //app状态(页面重载、菜单折叠、项目配置的抽屉)
│   │   │   ├── auth           //auth状态(用户信息、用户权益)
│   │   │   ├── route          //route状态(动态路由、菜单、路由缓存)
│   │   │   ├── setup-store    //setup-store示例
│   │   │   ├── tab            //tab状态(多页签、缓存页面的滚动位置)
│   │   │   └── theme          //theme状态(项目主题配置)
│   │   ├── plugins            //状态管理插件
│   │   └── subscribe          //订阅状态(状态变更后执行一些操作)
│   │       ├── app.ts         //订阅app的状态(配置弹窗打开时禁用body的滚动)
│   │       └── theme.ts       //订阅theme的状态(主题颜色变更、暗黑模式变更、页面横向滚动)
│   ├── styles                 //全局样式
│   │   ├── css                //css
│   │   └── scss               //scss
│   ├── typings                //TS类型声明文件(*.d.ts)
│   │   ├── api.d.ts           //请求接口返回的数据的类型声明
│   │   ├── business.d.ts      //业务相关的类型声明
│   │   ├── components.d.ts    //自动导入的组件的类型声明
│   │   ├── env.d.ts           //vue路由描述和请求环境相关的类型声明
│   │   ├── global.d.ts        //全局通用类型
│   │   ├── naive-ui.d.ts      //NaiveUI类型
│   │   ├── package.d.ts       //第三方依赖包的类型声明
│   │   ├── page-route.d.ts    //插件@soybeanjs/vite-plugin-vue-page-route生成的路由声明
│   │   ├── route.d.ts         //路由系统的类型声明
│   │   ├── router.d.ts        //vue的路由描述的类型声明
│   │   ├── storage.d.ts       //本地缓存的数据类型
│   │   ├── system.d.ts        //系统的类型声明
│   │   ├── union-key.d.ts     //联合类型
│   │   └── utils.d.ts         //类型工具合集
│   ├── utils                  //全局工具函数(纯函数，不含状态)
│   │   ├── common             //通用工具函数
│   │   ├── crypto             //数据加密工具函数
│   │   ├── form               //表单相关工具函数
│   │   ├── router             //路由相关工具函数
│   │   ├── service            //请求相关的工具函数
│   │   └── storage            //存储相关工具函数
│   ├── views                  //页面
│   │   ├── _builtin           //系统内置页面：登录、异常页等
│   │   ├── about              //关于
│   │   ├── auth-demo          //权限示例
│   │   ├── component          //插件、组件
│   │   ├── dashboard          //仪表盘
│   │   ├── document           //文档
│   │   ├── exception          //异常
│   │   ├── functiuon          //功能
│   │   ├── multi-menu         //多级菜单
│   │   └── plugin             //插件
│   ├── App.vue                //vue文件入口
│   └── main.ts                //项目入口ts文件
├── .editorconfig              //统一编辑器配置
├── .env                       //环境文件
├── .env-config.ts             //请求环境的配置文件
├── .eslintignore              //忽略eslint检查的配置文件
├── .eslintrc.js               //eslint配置文件
├── .gitattributes             //git配置，统一eol为LF
├── .gitignore                 //忽略git提交的配置文件
├── .npmrc                     //npm配置
├── CHANGELOG.md               //项目变更日志
├── changelogithub.config.json //github日志配置
├── index.html
├── Makefile                   //启动命令、包括docker命令
├── package.json               //npm依赖描述文件
├── pnpm-lock.yaml             //npm包管理器pnpm依赖锁定文件
├── README.md                  //项目介绍文档
├── tsconfig.json              //TS配置
├── uno.config.ts              //原子css框架unocss配置
└── vite.config.ts             //vite配置
```

## 路由管理

> 联合类型 RouteKey 声明所有的路由 key，方便统一管理路由， 该类型由插件@soybeanjs/vite-plugin-vue-page-route 根据 views 下面的页面文件自动生成。

## 系统图标

> 找图标：[图标库](https://icones.js.org/)

## 业务扩展

1. `views`文件夹下新建业务模块，`index.vue`做主组件，`components`文件夹下复制组件`table-action-modal.vue`用于`add、edit`等操作
2. `index.vue`中使用`@/hooks`中提供的`useHookTable`，该`hook`通过输入查询接口、接口传参(apiParams)、response数据转换器(transformer)、表格列项定义(columns)，输出相关响应式数据data(表格数据), loading(loading标记), columns(列项定义), pagination(分页器), getData(数据获取方法)，这些大多用于组件n-data-table
3. 新增业务模块文件需要重新运行打包命令`pnpm dev`，重新生成路由声明文件`\src\typings\page-route.d.ts`, `\src\views\index.ts`。（新增路由名称请查看该文件）

```html {.line-numbers}
<n-data-table
  class="flex-1-hidden"
  :columns="columns"
  :data="data"
  flex-height
  :loading="loading"
  :pagination="pagination"
  :checked-row-keys="userCheckList"
  :row-key="item => item.userId"
  @update-checked-row-keys="onUserCheck"
/>
```

tip：demo

```ts {.line-numbers}
const { data, loading, columns, pagination, getData } = useHookTable(fetchSysUserByPage, {
  apiParams: {
    page: 1,
    pageSize: 10
  },
  // 这里的d对应backendConfig中的datakey数据
  transformer: d => ({
    data: d.content,
    pageNum: d.current,
    pageSize: d.size,
    total: d.totalElements
  }),
  columns: () => [
    {
			// 表格首项使用多选框
      type: 'selection',
      align: 'center'
    },
    {
      key: 'userName',
      title: '用户名',
      align: 'center'
    },
    {
      key: 'roleName',
      title: '权限',
      align: 'center'
    },
    {
      key: 'statusName',
      title: '状态',
      align: 'center'
    },
    {
      key: 'mobile',
      title: '手机号',
      align: 'center'
    },
    {
      key: 'createTime',
      title: '创建时间',
      align: 'center'
    },
    {
      key: 'action',
      title: '操作',
      align: 'center',
      width: 120,
			// 使用render函数用tsx进行自定义渲染
      render(row) {
        return (
          <div class="flex gap-6px">
            <NButton size={'small'} onClick={() => handleEditTable(row.userId)}>
              编辑
            </NButton>
            <NPopconfirm onPositiveClick={() => handleDeleteTable([row.userId])}>
              {{
                default: () => '确认删除',
                trigger: () => <NButton size={'small'}>删除</NButton>
              }}
            </NPopconfirm>
          </div>
        );
      }
    }
  ]
});
```

3. `table-action-modal.vue`这个组件可高度自定义，直接使用情况参照user-manager用户管理模块的使用情况
