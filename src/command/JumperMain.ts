import * as vscode from "vscode";
import {Disposable} from "vscode";

import {BaseCommand} from "./BaseCommand";
import {MapperMappingContext} from "../mapping/MapperMappingContext";
import {Constant} from "../util/JavaDecode";
import {DocumentUtil} from "../util/DocumentUtil";

/**
 * 通过命令进行跳转
 */
export class JumperMain extends BaseCommand implements Disposable {
    dispose() {
        let cmd = JumperMain.getCommand("jumper");
        return vscode.commands.registerCommand(cmd, (specifiedPosition) => {
            this.doCommand(specifiedPosition);
        });
    }

    /**
     * 执行命令
     * @returns
     */
    async doCommand(specifiedPosition?: vscode.Position): Promise<void> {
        // 1. 获取指定位置处（或光标处）所处的文件和方法名称
        // 2. 如果是接口:
        // 2.1 获取文件名称, 当前的package, 组装namespace
        // 2.2 根据namespace获取缓存中的xml位置, 如果没有重新加载, 还是没有提示是否创建statement
        // 3. 如果是xml
        // 3.1 获取当前所在位置的id, 获取当前文件的namespace
        // 3.2 根据namespace获取缓存中接口的位置, 如果没有重新加载, 还是没有提示创建接口.

        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        let document = activeEditor.document;
        let word = this.findWordAroundPosition(activeEditor, specifiedPosition);
        let key = this.findKeyBeforePosition(activeEditor, specifiedPosition);

        let filePath = document.fileName;
        let fileNameWithSuffix = filePath.substring(filePath.lastIndexOf("\\") + 1);

        if (fileNameWithSuffix.endsWith("java")) {
            // 如果当前为java文件
            let mapperMapping = await MapperMappingContext.getMapperMappingByJavaFile(document);
            // 匹配xml中该方法位置
            if (mapperMapping.xmlPath) {
                this.jump(mapperMapping.xmlPath, word, "id", this.doWhenNotMatchXml);
            } else {
                vscode.window.showWarningMessage("没有对应的java接口文件!");
            }
        } else if (fileNameWithSuffix.endsWith("xml")) {
            // 判断当前选择的是方法还是连接
            // id type resultType parameterType resultMap parameterMap refid
            if (key === 'id') {
                // 如果当前文件为xml文件
                let mapperMapping = await MapperMappingContext.getMapperMappingByXmlFile(document);
                if (mapperMapping.javaPath) {
                    // 在java文件中搜索 不应该使用key
                    this.jump(mapperMapping.javaPath, word, undefined, this.doWhenNotMatchJava);
                } else {
                    vscode.window.showWarningMessage("没有对应的xml文件!");
                }
            } else if (["type", "resultType", "parameterType"].includes(key)) {
                let wordArr = word.split(/\./);
                if (wordArr.length === 1) {
                    // todo zx 支持别名方式
                    vscode.window.showWarningMessage("不支持别名和基础数据类型!");
                    return;
                }
                let files = await vscode.workspace.findFiles(Constant.getJavaPathByNamespace(word));
                if (files.length > 0) {
                    // 在java文件中搜索 不应该使用key
                    this.jump(vscode.Uri.parse(files[0].path), wordArr[wordArr.length - 1]);
                } else {
                    vscode.window.showWarningMessage("没有对应的类文件!");
                }
            } else if (["resultMap", "parameterMap", "refid"].includes(key)) {
                let wordArr = word.split(/\./g);
                let targetName = wordArr[wordArr.length - 1];
                if (wordArr.length > 1) {
                    // 使用namespace
                    let namespace = word.substring(0, word.indexOf(targetName) - 1);
                    let files = await vscode.workspace.findFiles(Constant.getXmlPathByNamespace(namespace));
                    if (files.length > 0) {
                        // 在xml文件中搜索 使用id更准确
                        this.jump(vscode.Uri.parse(files[0].path), targetName, "id");
                    } else {
                        vscode.window.showWarningMessage("没有对应的xml文件!");
                    }
                } else {
                    // 在xml文件中搜索 使用id更准确
                    this.contentMatch(document, word, "id");
                }
            }
        }
    }

    /**
     * 查找指定位置处（或光标处）的单词
     *
     * @param activeEditor 当前打开的文件
     * @returns
     */
    findWordAroundPosition(activeEditor: vscode.TextEditor, specifiedPosition?: vscode.Position): string {
        let document = activeEditor.document;
        let curPos = specifiedPosition ?? activeEditor.selection.active;
        let line = document.lineAt(curPos);
        let word = "";
        let pos = 0;
        for (let char of line.text.trimLeft()) {
            if (!Constant.PATTERN_CHAR.test(char)) {
                if (pos + line.firstNonWhitespaceCharacterIndex >= curPos.character) {
                    break;
                }
                pos++;
                word = "";
                continue;
            }
            pos++;
            word += char;
        }
        return word;
    }

    findKeyBeforePosition(activeEditor: vscode.TextEditor, specifiedPosition?: vscode.Position): string {
        let document = activeEditor.document;
        let curPos = specifiedPosition ?? activeEditor.selection.active;
        let word = "";

        word = this.findWordBeforePosition(document, curPos.line, curPos.character);
        return word;
    }

    /**
     * 在指定位置之前找一个单词
     */
    findWordBeforePosition(document: vscode.TextDocument, lineIndex: number, curIndex?: number): string {
        for (let i = lineIndex; i > 0; i--) {
            let line = document.lineAt(i);
            let words = [];
            for (let s of line.text.split(/[\s=<>"']/)) {
                if (s.length > 0) {
                    words.push(s);
                }
            }
            if (words.length === 0) {
                continue;
            }
            let lastIndex = 0;
            if (curIndex) {
                // 如果限制搜索范围
                let lastSearchWord = null;
                for (let word of words) {
                    let wordStartIndex = line.text.indexOf(word, lastIndex);
                    let wordEndIndex = wordStartIndex + word.length;
                    if (wordEndIndex >= curIndex) {
                        break;
                    } else {
                        if (word.length > 0) {
                            lastSearchWord = word;
                        }
                        lastIndex = wordEndIndex;
                    }
                }
                if (lastSearchWord && lastSearchWord.length > 0) {
                    return lastSearchWord;
                } else {
                    curIndex = undefined;
                }
            } else {
                return words[words.length - 1];
            }
        }
        return '';
    }

    /**
     * 跳转到指定文件 指定单词的位置
     * @param path
     * @param word
     * @param doWhenNotMatch
     */
    jump(path: vscode.Uri, word: string, key?: string, doWhenNotMatch?: (document: vscode.TextDocument, word: string) => Promise<void>) {
        vscode.workspace.openTextDocument(path).then(async (doc) => {
            this.contentMatch(doc, word, key, doWhenNotMatch);
        });
    }

    async contentMatch(doc: vscode.TextDocument, word: string, key?: string, doWhenNotMatch?: (document: vscode.TextDocument, word: string) => Promise<void>) {
        let wordIndexAtLine = -1;
        let lineNumber = 0;
        for (; lineNumber < doc.lineCount; lineNumber++) {
            let lineText = doc.lineAt(lineNumber);
            wordIndexAtLine = lineText.text.indexOf(word);
            if (wordIndexAtLine !== -1) {
                if (key) {
                    let findKey = this.findWordBeforePosition(doc, lineNumber, wordIndexAtLine);
                    if (findKey === key) {
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        // 没有匹配到文本
        if (wordIndexAtLine === -1 && doWhenNotMatch) {
            await doWhenNotMatch(doc, word);
        } else {
            let pos = new vscode.Position(lineNumber, wordIndexAtLine === -1 ? 0 : wordIndexAtLine);
            await vscode.window.showTextDocument(doc, 1, false).then((editor) => {
                // 跳转之后选中单词
                let selectEnd = new vscode.Position(pos.line, pos.character + word.length);
                let range = new vscode.Range(pos, selectEnd);
                editor.selection = new vscode.Selection(pos, selectEnd);
                editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
            });
        }
    }

    /**
     * 当在xml文件中没有匹配的statement时, 决定如何处理
     * @param doc
     * @param word
     */
    async doWhenNotMatchXml(doc: vscode.TextDocument, word: string) {
        let res = await vscode.window.showQuickPick(["jump directly", "stay here", "create statement"], {
            canPickMany: false,
            title: "cannot find sql in xml, so next to do?",
        });
        if (!res || res === "stay here") {
            return;
        }
        if (res === "jump directly") {
            let pos = new vscode.Position(0, 0);
            vscode.window.showTextDocument(doc, 1, false).then((editor) => {
                editor.selection = new vscode.Selection(pos, pos);
            });
            return;
        }
        if (res === "create statement") {
            let addContent = DocumentUtil.createStatement(doc, word);
            vscode.window.showTextDocument(doc, 1, false).then((editor) => {
                vscode.window.activeTextEditor?.edit((edit) => {
                    if (addContent) {
                        edit.insert(addContent.position, addContent.content);
                        editor.revealRange(new vscode.Range(addContent.position, addContent.position), vscode.TextEditorRevealType.InCenter);
                    }
                });
            });
        }
    }

    /**
     * 当java文件中没有匹配的method时, 决定如何处理
     * @param doc
     * @param word
     */
    async doWhenNotMatchJava(doc: vscode.TextDocument, word: string) {
        let res = await vscode.window.showQuickPick(["jump directly", "stay here", "create abstract method"], {
            canPickMany: false,
            title: "cannot find method in interface, so next to do?",
        });

        if (!res || res === "stay here") {
            return;
        }
        if (res === "jump directly") {
            let pos = new vscode.Position(0, 0);
            vscode.window.showTextDocument(doc, 1, false).then((editor) => {
                editor.selection = new vscode.Selection(pos, pos);
            });
            return;
        }
        if (res === "create abstract method") {
            let addContent = DocumentUtil.createAbstractMethod(doc, word);
            vscode.window.showTextDocument(doc, 1, false).then((editor) => {
                vscode.window.activeTextEditor?.edit((edit) => {
                    if (addContent) {
                        edit.insert(addContent.position, addContent.content);
                        editor.revealRange(new vscode.Range(addContent.position, addContent.position), vscode.TextEditorRevealType.InCenter);
                    }
                });
            });
        }
    }
}
