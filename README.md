# db-guard-web

一个数据库AI接入能力工具界面

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


### docker部署

```sh
docker pull registry.cn-hangzhou.aliyuncs.com/choyrunyu/db-guard-web:1.0

docekr run -it -d -p 8002:80 \
--add-host db-guard-api:后端接口ip \
--name db-guard-web \
registry.cn-hangzhou.aliyuncs.com/choyrunyu/db-guard-web:1.0

# 挂载日志
-v 宿主机路径:/var/log/nginx 
# 挂载配置文件
-v 宿主机配置文件路径:/etc/nginx/nginx.conf 

```
