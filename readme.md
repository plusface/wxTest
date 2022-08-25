### 微信测试号定时发送

- 支持配置多用户、定时时间、颜色等
- `config.json` 配置 appid,apiKey 等相关运行时参数, 内有注释
- `.github\workflows` github actions 工作流程
- 上传 github 时只需要`index.js`和`config.json`文件, 其他皆为开发时需要
- 隐私配置参数部分我已删除，自行配置

#### 当前模板格式

```
{{date.DATA}}
城市: {{city.DATA}}
天气: {{weather.DATA}} {{temperature.DATA}}
建议: {{tips.DATA}}
想说: {{pyqwenan.DATA}}
星座寄语: {{horoscope.DATA}}

```

### 同行可以看（node 环境）

1. `yarn install` 安装依赖
2. `yarn dev` 本地打包测试
3. `yarn build` 只打包
