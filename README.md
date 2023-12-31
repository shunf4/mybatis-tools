# mybatis-tools

mybatis 框架工具集

## Features

### 方法跳转

> 只对（src/main目录下）的路径有效。
  
**操作方法：**  

a. 当光标位于`接口方法`或者`statement id`上，使用快捷键或命令（具体查看命令章节）。  
b. mapper接口和xml有跳转提示（`go to Mapper XML`, `go to Mapper java`），点击即可跳转。（感谢`shunf4`同学的pr. ^_^）  
c. 不存在对应的java方法, 或者动态sql, 允许自动创建.  
    此时会提示三种选项:  

- 直接跳转到文件
- 不跳转
- 创建方法或者动态sql（创建位置为末尾）

c. 支持引用跳转  
对xml中的`type`，`resultType`，`parameterType`，`resultMap`，`parameterMap`，`refid`跳转到指定位置进行支持。  

> 目前只支持项目中的类, 不支持别名方式，不支持基础类型。

### 日志格式化

> 目前支持MYSQL, ORACLE, 默认为MYSQL

**操作方法：**  

首先复制要转换的sql日志，使用快捷键或命令（具体查看命令章节）。  

**注意：**  

复制的日志必须包含：`Preparing:`, `Parameters:`。

### 文件生成器

**操作方法：**

1. 使用`ctrl+m ctrl+g`，打开文件生成器页面。  
2. 在生成策略页面按需配置即可。注意需要先配置数据库信息。

**注意：**  

1. 项目路径为`/a/b/c`形式, 如果指定磁盘则需在最前面加上`/`, 如`/D:/a/b/c`。
2. 数据库配置需要提前配置好，并且确保连接成功。
3. 如果需要删除之前的配置，可以找到配置文件后，在配置文件中删除。
4. 字段类型匹配根据正则表达式，如果有多个符合则取最长的表达式对应的类型。

**关于路径配置的细节：**

1. 项目路径必须配置。
2. 只配置项目路径，所有文件生成在该路径下。
3. xml路径不配置，xml生成到接口同目录下。
4. entity不配置，entity文件生成到顶级包路径下。
5. mapper接口不配置，接口和xml文件生成到顶级包路径下。
6. 顶级包路径和项目路径间自动加上`src/main/java`路径
7. xml路径前自动加上`src/main/resources`路径。
8. 顶级目录为绝对地址，其他为相对位置。
9. 如果不配置顶级包，entity，mapper，xml包包名需要手动修改。

**关于oracle数据库连接：**  

oracle的连接需要借助jdk才可以运行，因此需要你本地安装客户端。  
前提：安装[oracle client](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html)
并配置环境变量, 参考[nodejs 使用官方oracledb库连接数据库 教程](https://www.cnblogs.com/rysinal/p/7779055.html)

### 缓存

> 缓存不是用户必须操作的项目。

**关于缓存的使用：**  

a. 当调整文件位置、变更接口文件名、命名空间后，应该要清理缓存的映射文件位置。（ctrl+m ctrl+c）  
b. 会加载项目中所有的映射关系，用于跳转时加速查找映射。（ctrl+m ctrl+d）

## 命令

所有命令均为`mybatis-tools`作为分组前缀. 以下所有快捷键均为组合键。（当然`ctrl+shift+p`, 之后输入命令也是可以的）

| 命令                       | 快捷键        | 含义                                                                                 |
| :------------------------- | :------------ | :----------------------------------------------------------------------------------- |
| `mybatis-tools.jumper`     | ctrl+m ctrl+j | 跳转功能, 当光标位于`接口方法`或者`statement id`上，使用该命令即可                                       |
| `mybatis-tools.log-format` | ctrl+m ctrl+f | mybatis 日志格式化 将参数填充到动态sql中, 注意需要包含: `Preparing:`, `Parameters:`  |
| `mybatis-tools.config`     | ctrl+m ctrl+c | 加载项目中的命名空间及映射. 如果之后调整过文件位置需要重新执行该命令或者执行清理命令 |
| `mybatis-tools.clean`      | ctrl+m ctrl+d | 清除映射关系缓存                                                                     |
| `mybatis-tools.generate-file`   | ctrl+m ctrl+g | 文件生成器                                                                     |

## Extension Settings

### 数据库类型  

> 当使用日志填充命令时, 需要根据数据库类型进行转换某些类型（如: date）  
  如果不使用该配置，会弹出一个选择框，需要选中数据库类型。  
  该配置作用于工作空间  

在工作空间的setting.json第一层级, 插入如下配置：

```json
"mybatis-tools.databaseType": "mysql",
```

**注意：**  

目前支持mysql，oracle。

## Known Issues

## Release Notes

### 1.3.0

1. 全局mapper映射索引减少findFiles调用量，调用过程加锁
2. 跳转文件识别适配Unix系统的正斜杠“/”

### 1.2.0

new features:

- mapper接口和xml添加跳转提示(`go to Mapper XML`, `go to Mapper java`)。通过点击即可跳转.
（感谢`shunf4`同学的pr. ^_^）

### 1.1.1

bug fix:

1. 判断条件错误, 不使用lombok, 无法生成get set方法.

### 1.1.0

new features:

1. 对xml中的type resultType parameterType resultMap parameterMap refid跳转到指定位置进行支持  
    注意需要将光标放置在值上,使用快捷键.

    目前只支持项目中的类和xml文件, 不支持类别名，不支持基础类型。

### 1.0.2

new features:

1. 可以控制是否生成某些文件
2. 控制是否使用mybatis-plus注解
3. 实体类后缀自定义

### 1.0.1

new features:

1. 默认类型映射完善。
2. 删除功能数据库配置和类型映射功能
3. 增加类名后缀自定义, 是否使用mybatis-plus注解自定义

### 1.0.0

new features:

1. 支持生成数据库表对应的实体类，xml，mapper接口文件
2. 通过webview页面进行交互。（命令ctrl+m, ctrl+g）
3. 支持自定义生成文件中元素内容。（目前支持lombok, swagger）
4. 支持数据类型映射的自定义。
5. 支持数据库配置的保存。
6. 支持oracle, mysql数据库。
7. 比较人性化的生成路径配置。(请详细阅读路径细节配置)
8. 明暗主题切换。（右上角）
9. 支持内网环境使用。

todo:

1. 更多连接方式支持（目前只支持账号密码方式）
2. 默认类型映射完善。
3. 删除功能（目前删除配置只能在配置文件中删除）

### 0.0.6

bug fix:

1. 修复参数中含有空字符时，会将类型作为参数的问题。

### 0.0.5

new features:

- 缓存优化
  1. 文件查找范围为 `**/src/main/**`
- 新增手动清除缓存命令

### 0.0.4

bug fix:

跳转后选中单词, 并且将选中位置显示在当前屏幕中.

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

**Enjoy!**
