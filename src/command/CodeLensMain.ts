import {CancellationToken, CodeLens, CodeLensProvider, Disposable, languages, TextDocument} from "vscode";
import {MapperMappingContext} from "../mapping/MapperMappingContext";
import {InterfaceDecode} from "../util/JavaDecode";
import {JumperMain} from "./JumperMain";

export class CodeLensMain implements Disposable, CodeLensProvider {
    dispose() {
        return languages.registerCodeLensProvider(
            [{
                scheme: 'file',
                language: 'java'
            }, {
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
            case 'xml':
                return await this.provideXmlCodeLenses(document, token);
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
        // XML文件的CodeLens
        let mapperMapping = await MapperMappingContext.getMapperMappingByXmlFile(document);
        let xmlIds = mapperMapping.xmlIds;
        let content = document.getText();


        let codeLensList: Array<CodeLens> = [];
        xmlIds.forEach((method, key) => {
            let regExp = new RegExp(`(?<=id\\s*=\\s*")${method.id}(?=")`, 'g');
            let methodPositions = Array.from(content.matchAll(regExp)).map(m => m.index || 0);
            for (const methodPosition of methodPositions) {
                const wordPosition = document.positionAt(methodPosition);
                const wordRange = document.getWordRangeAtPosition(wordPosition);
                if (!wordRange) {
                    return null;
                }

                let cl = new CodeLens(
                    wordRange,
                    {
                        command: JumperMain.getCommand("jumper"),
                        title: 'Go to Mapper Java',
                        tooltip: 'will open specific .java file',
                        arguments: [
                            wordPosition,
                        ]
                    },
                );
                codeLensList.push(cl);
            }
        });
        return codeLensList;
    }
}

