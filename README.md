# mybatis-tools

mybatis 框架工具集

> 虽然我建议你优先选择`MybatisX`这个插件, 但是我使用的时候, `MybatisX`一直在初始化.... 384s之后才初始化完成.  
之后当前java接口文件可以跳转了, 但换了个新的接口就又不行了~~ 
我醉了. 我只想查看当前文件方法的跳转啊! 然后我就写了这款插件.

## Features

- 方法跳转支持  
  从java方法跳转到xml动态sql  
  从xml跳转到java方法.
- 不存在对应的java方法, 或者动态sql, 此时会提示三种选项:
  1. `直接跳转到文件`
  2. `不跳转`
  3. `创建方法或者动态sql`(创建位置为末尾)
- 日志格式化(目前支持MYSQL, ORACLE, 默认为MYSQL)  
  将参数填充到动态sql中, 并且允许多个sql填充.  
  注意多线程情况下, sql的输出并不是顺序的, 此时插件会按照参数个数进行匹配(当然可能不是正确的). 所以尽量还是单个sql转换, 或者有顺序的多个sql转换为好.

### 命令

所有命令均为`mybatis-tools`作为分组前缀. 以下所有快捷键均为组合键.(当然`ctrl+shift+p`, 之后输入命令也是可以的)

| 命令                       | 快捷键        | 含义                                                                         |
| :------------------------- | :------------ | :--------------------------------------------------------------------------- |
| `mybatis-tools.config`     | ctrl+m ctrl+c | 加载项目中的 xml配置, 使用该命令后, 如果之后调整过文件位置需要重新执行该命令 |
| `mybatis-tools.jumper`     | ctrl+m ctrl+j | 跳转功能, 当光标位于方法单词上, 使用该命令即可                               |
| `mybatis-tools.log-format` | ctrl+m ctrl+f | mybatis 日志格式化 将参数填充到动态sql中, 注意需要包含: Preparing, Parameter |

## Extension Settings

在工作空间的setting.json第一层级, 插入如下配置:

```json

mybatis-tools: {
    datasourceType: "MYSQL"
}

```

## Known Issues

1. 跳转到指定文件位置, 光标方法位置不在当前屏幕

## Release Notes

### 0.0.3

new features:

1. 日志格式化
2. 插件有logo了! \\(T_T)/
3. 完善readme.

### 0.0.2

new features:

1. 当匹配不到跳转的方法或者sql时, 提示创建方法或动态sql选项.
2. 增加命令对应的快捷键.
3. 完善readme.

fix bugs:

1. 光标位于单词末尾无法跳转

### 0.0.1

Initial release of mybatis-tools, this version only for test.

-----------------------------------------------------------------------------------------------------------


### For more information

- [项目源码](https://gitee.com/NikolaZhang/mybatis-tools)

**Enjoy!**
