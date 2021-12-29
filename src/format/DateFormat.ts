import { stringify } from "querystring";
import { DatabaseType } from "./BaseParameterTypeHandler";

export class DateFormat {
  /**
   * 对日期字符串进行格式匹配
   * 如果没有匹配的格式返回第一个
   * @param date
   */
  static match(date: string, databaseType: DatabaseType): string {
    // 根据数据库类型获取样式
    let dateFormatStyle;
    if (databaseType === DatabaseType.ORACLE) {
      dateFormatStyle = new OracleDateFormatStyle();
    } else {
      dateFormatStyle = new MysqlDateFormatStyle();
    }
    let formatStyle = dateFormatStyle.getFormatStyle();

    for (let [key, value] of formatStyle.entries()) {
      if (key.test(date)) {
        return value;
      }
    }

    return formatStyle.values().next().value;
  }
}

abstract class DateFormatStyle {
  /**
   * 加载日期格式
   * 为方便扩展使用 正则 -> 日期格式
   */
  abstract getFormatStyle(): Map<RegExp, string>;
}

class OracleDateFormatStyle extends DateFormat {
  /**
   * 加载所有日期格式
   * oracle 不区分大小写 使用mi表示分钟
   * @returns
   */
  getFormatStyle(): Map<RegExp, string> {
    let formatMap = new Map<RegExp, string>();
    formatMap.set(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/m, "yyyy-mm-dd hh24:mi:ss");
    formatMap.set(/^\d{2}:\d{2}:\d{2}$/m, "hh24:mi:ss");
    formatMap.set(/^\d{4}-\d{2}-\d{2}$/m, "yyyy-mm-dd");

    formatMap.set(/^\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}$/m, "yyyy/mm/dd hh24:mi:ss");
    formatMap.set(/^\d{4}\/\d{2}\/\d{2}$/m, "yyyy/mm/dd");

    formatMap.set(/^\d{14}$/m, "yyyymmddhh24miss");
    formatMap.set(/^\d{8}$/m, "hh24miss");
    formatMap.set(/^\d{6}$/m, "yyyymmdd");
    return formatMap;
  }
}

class MysqlDateFormatStyle extends DateFormat {
  /**
   * 加载所有日期格式
   * oracle 不区分大小写 使用mi表示分钟
   * @returns
   */
  getFormatStyle(): Map<RegExp, string> {
    let formatMap = new Map<RegExp, string>();
    formatMap.set(/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/m, "%Y-%m-%d %H:%i:%S");
    formatMap.set(/^\d{2}:\d{2}:\d{2}$/m, "%H:%i:%S");
    formatMap.set(/^\d{4}-\d{2}-\d{2}$/m, "%Y-%m-%d");

    formatMap.set(/^\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}$/m, "%Y/%m/%d %H:%i:%S");
    formatMap.set(/^\d{4}\/\d{2}\/\d{2}$/m, "%Y/%m/%d");

    formatMap.set(/^\d{14}$/m, "%Y%m%d%H%i%S");
    formatMap.set(/^\d{8}$/m, "%H%i%S");
    formatMap.set(/^\d{6}$/m, "%Y%m%d");
    return formatMap;
  }
}
