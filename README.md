# mybatis-tools

mybatis 框架工具集

## Features

- 1. 方法跳转支持  
  从java方法跳转到xml动态sql, 从xml跳转到java方法.
- 2. 不存在对应的java方法, 或者动态sql:
  提示是否进行创建方法(此时会提示三种选项, 直接跳转到java文件, 不跳转, 创建方法或者动态sql(创建位置为末尾))

### 命令

所有命令均为`mybatis-tools`作为分组前缀. 以下所有快捷键均为组合键.

| 命令                   | 快捷键        | 含义                                                                           |
| :--------------------- | :------------ | :----------------------------------------------------------------------------- |
| `mybatis-tools.config` | ctrl+m ctrl+c | 加载项目中的 xml配置, s使用该命令后, 如果之后t调整过文件位置需要重新执行该命令 |
| `mybatis-tools.jumper` | ctrl+m ctrl+j | 跳转功能, 当光标位于单词上, 使用该命令即可                                     |

## Requirements

## Extension Settings

## Known Issues

1. 跳转到指定文件位置, 光标方法位置不在当前屏幕

## Release Notes

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

## Working with Markdown

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
