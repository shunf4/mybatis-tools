import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 获取插件中文件, 并读取
 * @param context
 * @param templatePath
 * @returns
 */
export const readExtentsionFile = (context: vscode.ExtensionContext, templatePath: string): string => {
    const resourcePath = path.join(context.extensionPath, templatePath);
    const dirPath = path.dirname(resourcePath);
    let html = fs.readFileSync(resourcePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
        return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({scheme: 'vscode-resource'}).toString() + '"';
    });
    return html;
};

