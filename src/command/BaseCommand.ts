export abstract class BaseCommand {
  public static pluginName = "mybatis-tools";

  public static getCommand(shortName: string): string {
    return this.pluginName + "." + shortName;
  }

  abstract doCommand(): void;
}
