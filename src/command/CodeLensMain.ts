import { CancellationToken, CodeLens, CodeLensProvider, Disposable, languages, ProviderResult, TextDocument } from "vscode";
import { MapperMappingContext } from "../mapping/MapperMappingContext";
import { InterfaceDecode } from "../util/JavaDecode";
import { BaseCommand } from "./BaseCommand";
import { JumperMain } from "./JumperMain";

export class CodeLensMain implements Disposable, CodeLensProvider {
  dispose() {
    return languages.registerCodeLensProvider(
      [{
        scheme: 'file',
        language: 'java'
      },{
        scheme: 'file',
        language: 'xml'
      }],
      this
    );
  }

  async provideCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
    switch (document.languageId) {
      case 'java':
        return await this.provideJavaCodeLenses(document, token);
        break;
      case 'xml':
        return await this.provideXmlCodeLenses(document, token);
        break;
      default:
        return [];
    }
  }

  async provideJavaCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
    let mapperMapping = await MapperMappingContext.getMapperMappingByJavaFile(document);
    if (!mapperMapping.xmlPath) {
      return [];
    }
    const javaContent = document.getText();

    return (InterfaceDecode.method(javaContent) ?? []).map(method => {
      const wordPosition = document.positionAt(method.position);
      const wordRange = document.getWordRangeAtPosition(wordPosition);
      if (!wordRange) {
        return null;
      }

      return new CodeLens(
        wordRange,
        {
          command: JumperMain.getCommand("jumper"),
          title: 'Go to Mapper XML',
          tooltip: 'will open specific .xml file',
          arguments: [
            wordPosition,
          ]
        },
      );
    }).filter((p): p is CodeLens => !!p);
  }

  async provideXmlCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]> {
    // TODO: 添加XML文件的CodeLens
    return [];
  }
}

