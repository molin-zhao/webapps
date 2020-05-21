---
title: 使用hexo建立静态博客
---
hexo是一款基于nodejs的静态博客框架，使用Markdown语言编写博客，配置信息包含在yml文件当中。

## 项目准备

``` bash
$ npm install hexo-cli -g
$ hexo init blog
$ cd blog
$ npm install
$ hexo server
```

### 建立一个新页面

``` bash
$ hexo new "你的新博客名称"
```

### 启动服务

``` bash
$ hexo server
```

### 构建静态资源

``` bash
$ cd hexo/
$ hexo generate
```

所有静态资源生成在项目根路径下public文件夹

### 远程部署

``` bash
$ hexo deploy
```
