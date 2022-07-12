export const FILE_GENERATE_VIEW = `
<!DOCTYPE html>
<html>

<head>
    <title>mybatis-tools文件生成器</title>
    <meta charset="UTF-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" crossorigin="anonymous"
        rel="stylesheet">
</head>

<body>
    <div>
        <div class="container">
            <!-- header -->
            <nav class="navbar navbar-expand-lg navbar-light bg-light" aria-label="mybatis-tools-nav">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <img src="/images/icon.png" alt="" width="30" height="30" class="d-inline-block align-text-top">
                        文件生成器
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link" href="#" onclick="jump('dbConfig')">数据库配置</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onclick="jump('typeConfig')">数据类型映射</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#" onclick="jump('strategyConfig')">生成策略配置</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        <!-- 页面展示区域 -->
        <div>
            <div id="dbConfig" style="display: none;">
                <!-- 数据库配置 -->
                <div class="container">
                    <nav aria-label="db-nav">
                        <div class="nav nav-tabs" id="nav-db-config-tab" role="tablist">
                            <button class="nav-link active" id="nav-mysql-config-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-mysql-config" type="button" role="tab"
                                aria-controls="nav-mysql-config" aria-selected="true">Mysql
                            </button>
                            <button class="nav-link" id="nav-oracle-config-tab" data-bs-toggle="tab"
                                data-bs-target="#nav-oracle-config" type="button" role="tab"
                                aria-controls="nav-oracle-config" aria-selected="false">Oracle
                            </button>
                        </div>
                    </nav>
                    <!-- 数据库配置 -->
                    <div class="tab-content" id="nav-db-config-tabContent">
                        <div class="tab-pane fade show active" id="nav-mysql-config" role="tabpanel"
                            aria-labelledby="nav-mysql-config-tab">
                            <!-- mysql配置 -->
                            <form name="db-mysql">
                                <div class="input-group mb-3">
                                    <span class="input-group-text">TAG</span>
                                    <input id="db_mysql_tag" type="text" name="tag" class="form-control" />
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">URL</span>
                                    <input id="db_mysql_url" type="text" name="url" onchange="urlDecode('mysql')"
                                        class="form-control" />
                                </div>
                                <div class="row g-2 align-items-start">
                                    <div class="col">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">Host</span>
                                            <input id="db_mysql_host" type="text" name="host" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">Port</span>
                                            <input id="db_mysql_port" type="text" name="port" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">Database</span>
                                            <input id="db_mysql_database" type="text" name="database"
                                                class="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-2 align-items-start">
                                    <div class="col">
                                        <div class="col-auto input-group mb-3">
                                            <span class="input-group-text">User</span>
                                            <input id="db_mysql_user" type="text" name="user" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="col-auto input-group mb-3">
                                            <span class="input-group-text">Password</span>
                                            <input id="db_mysql_password" type="password" name="password"
                                                class="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-2 justify-content-between">
                                    <div class="col">
                                        <button type="button" class="btn btn-info" onclick="dbConnectTest('mysql')">连接测试
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-success" onclick="dbSave('mysql')">保存
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-primary" onclick="dbReset('mysql')">重置
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-primary" onclick="dbList('mysql')">配置列表
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <!-- oracle配置 -->
                        <div class="tab-pane fade" id="nav-oracle-config" role="tabpanel"
                            aria-labelledby="nav-oracle-config-tab">
                            <form name=" db-oracle">
                                <div class="input-group mb-3">
                                    <span class="input-group-text">TAG</span>
                                    <input id="db_oracle_tag" type="text" name="tag" class="form-control" />
                                </div>
                                <div class="input-group mb-3">
                                    <span class="input-group-text">URL</span>
                                    <input id="db_oracle_url" type="text" name="url" onchange="urlDecode('oracle')"
                                        class="form-control" />
                                </div>
                                <div class="row g-2 align-items-start">
                                    <div class="col">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">Host</span>
                                            <input id="db_oracle_host" type="text" name="host" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">Port</span>
                                            <input id="db_oracle_port" type="text" name="port" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="input-group mb-3">
                                            <span class="input-group-text">SID</span>
                                            <input id="db_oracle_sid" type="text" name="sid" class="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-2 align-items-start">
                                    <div class="col">
                                        <div class="col-auto input-group mb-3">
                                            <span class="input-group-text">User</span>
                                            <input id="db_oracle_user" type="text" name="user" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="col-auto input-group mb-3">
                                            <span class="input-group-text">Password</span>
                                            <input id="db_oracle_password" type="password" name="password"
                                                class="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row g-2 justify-content-between">
                                    <div class="col">
                                        <button type="button" class="btn btn-info"
                                            onclick="dbConnectTest('oracle')">连接测试
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-success" onclick="dbSave('oracle')">保存
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-primary" onclick="dbReset('oracle')">重置
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-primary" onclick="dbList('oracle')">配置列表
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <!-- 数据库配置信息 -->
                    <div>
                        <table class="table" id="dbConfiglist">
                            <thead>
                                <tr>
                                    <th scope="col">tag</th>
                                    <th scope="col">host</th>
                                    <th scope="col">port</th>
                                    <th scope="col">jdbc-url</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <a href="#" onclick="openConfigFile()">打开配置文件</a>
                </div>
            </div>
            <!-- 数据类型配置 -->
            <div id="typeConfig" style="display: none;">
                <div>
                    <div class="row align-items-start">
                        <div class="col form-check" onclick="listDataType('mysql')">
                            <input class="form-check-input" type="radio" name="dbType" id="flexRadioDefault1"
                                value="mysql" checked>
                            <label class="form-check-label" for="flexRadioDefault1">
                                mysql
                            </label>
                        </div>
                        <div class="col form-check" onclick="listDataType('oracle')">
                            <input class="form-check-input" type="radio" name="dbType" id="flexRadioDefault2"
                                value="oracle">
                            <label class="form-check-label" for="flexRadioDefault2">
                                oracle
                            </label>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-success" onclick="addDataType()">新增</button>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-success" onclick="saveDataType()">保存</button>
                        </div>
                    </div>
                    <table class="table" id="type-table">
                        <thead>
                            <tr>
                                <th scope="col">data type</th>
                                <th scope="col">java type</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <a href="#" onclick="openConfigFile()">打开配置文件</a>
            </div>
            <!-- 策略信息配置 -->
            <div id="strategyConfig" style="display: block;">
                <div class="container">
                    <form>
                        <div class="input-group mb-3">
                            <span class="input-group-text">项目路径</span>
                            <input type="text" class="form-control" id="projectPathId" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">entity包路径</span>
                            <input type="text" class="form-control" id="entityPathId" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">mapper java包路径</span>
                            <input type="text" class="form-control" id="interfacePathId" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">mapper xml包路径</span>
                            <input type="text" class="form-control" id="xmlPathId" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">表名</span>
                            <input type="text" class="form-control" id="tableNameId" />
                        </div>

                        <div class="col form-check" onclick="listDbEnv('mysql')">
                            <input class="form-check-input" type="radio" name="dbEnv" id="listDbEnv1" value="mysql"
                                checked>
                            <label class="form-check-label" for="listDbEnv1">
                                mysql
                            </label>
                        </div>
                        <div class="col form-check" onclick="listDbEnv('oracle')">
                            <input class="form-check-input" type="radio" name="dbEnv" id="listDbEnv2" value="oracle">
                            <label class="form-check-label" for="listDbEnv2">
                                oracle
                            </label>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">数据库环境</span>
                            <select class="form-control form-select" id="dbEnvId">
                            </select>
                        </div>
                    </form>
                    <button type="button" class="btn btn-success" onclick="generateFile()">保存</button>
                </div>
            </div>
        </div>
    </div>
</body>
<!-- JavaScript Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    crossorigin="anonymous"></script>
<script type="text/javascript">
    const vscode = acquireVsCodeApi();
    // 当为文本时需要全是\\
    // const mysqlJdbcRegex = /^jdbc:mysql:\/\/([\da-zA-Z-\.]+):(\d+)\/([A-Za-z0-9_]+)(\?(\S*))?$/;
    // const oracleJdbcRegex = /^jdbc:oracle:thin:@([\da-zA-Z-\.]+):(\d+):([A-Za-z0-9_]+)$/;
    const mysqlJdbcRegex = /^jdbc:mysql:\\/\\/([\\da-zA-Z-\\.]+):(\\d+)\\/([A-Za-z0-9_]+)(\\?(\\S*))?$/;
    const oracleJdbcRegex = /^jdbc:oracle:thin:@([\\da-zA-Z-\\.]+):(\\d+):([A-Za-z0-9_]+)$/;

    window.addEventListener('message', event => {
        const msg = event.data;
        console.log('webview 接收到消息', msg);
        let data = msg.data;
        switch (msg.command) {
            case 'dbListResult':
                clearList('dbConfiglist');
                let tb = document.getElementById('dbConfiglist');
                for (let i = 0; i < data.length; i++) {
                    let x = tb.insertRow();
                    let cell = x.insertCell();
                    cell.innerHTML = data[i]["tag"];
                    cell = x.insertCell();
                    cell.innerHTML = data[i]["host"];
                    cell = x.insertCell();
                    cell.innerHTML = data[i]["port"];
                    cell = x.insertCell();
                    cell.innerHTML = data[i]["url"];
                }
                break;
            case 'dataTypeResult':
                clearList('type-table');
                let typeTable = document.getElementById('type-table');
                for (let i = 0; i < data.length; i++) {
                    let x = typeTable.insertRow();
                    let cell = x.insertCell();
                    cell.innerHTML = showColumnTypes(data[i]["columnType"]);
                    cell = x.insertCell();
                    cell.innerHTML = showJavaTypes(data[i]["javaType"]);
                }
                break;
            case 'listDbEnvResult':
                let envSelect = document.getElementById('dbEnvId');
                let options = '';
                for (let d of data) {
                    let option = '<option value="' + d.tag + '">' + d.tag + '</option>';
                    options = options + option;
                }
                envSelect.innerHTML = options;
                break;
            default:
                ;
        }
    });

    /** 清理table */
    function clearList(tableId) {
        let tb = document.getElementById(tableId);
        var rowNum = tb.rows.length;
        for (i = 1; i < rowNum; i++) {
            tb.deleteRow(i);
            rowNum = rowNum - 1;
            i = i - 1;
        }
    }


    /** 通过nav切换页面 */
    function jump(pageId) {
        let pageIds = ['dbConfig', 'strategyConfig', 'typeConfig'];
        pageIds.forEach((id, index, arr) => {
            document.getElementById(id).style.display = "none";
        });
        if (pageId === 'dbConfig') {
            dbList('mysql');
        }
        if (pageId === 'strategyConfig') {
            listDbEnv('mysql');
        }

        document.getElementById(pageId).style.display = "block";
    }

    /** 打开配置文件 */
    function openConfigFile() {
        vscode.postMessage({
            command: 'openConfigFile',
        });
    }


    // ~ ------------------------------------------------------------------------------------------------------------
    // 数据库配置
    // ~ ------------------------------------------------------------------------------------------------------------
    function dbList(type) {
        vscode.postMessage({
            command: 'dbList',
            type: type
        });
    }

    function dbSave(type) {
        if (type === 'mysql') {
            data = getMysqlDBFormData();
        } else if (type === 'oracle') {
            data = getOracleDBFormData();
        } else {
            return;
        }

        console.log('保存数据:', data);
        vscode.postMessage({
            command: 'dbSave',
            type: type,
            data: data
        });
        // 重新加载配置
        dbList(type);
    }

    function dbConnectTest(type) {
        if (type === 'mysql') {
            data = getMysqlDBFormData();
        } else if (type === 'oracle') {
            data = getOracleDBFormData();
        } else {
            return;
        }

        console.log('连接测试:', data);
        vscode.postMessage({
            command: 'dbConnectTest',
            type: type,
            data: data
        });
    }

    function dbReset(type) {
        if (type === 'mysql') {
            document.getElementById('db_mysql_tag').value = '';
            document.getElementById('db_mysql_url').value = '';
            document.getElementById('db_mysql_host').value = '';
            document.getElementById('db_mysql_port').value = '';
            document.getElementById('db_mysql_database').value = '';
            document.getElementById('db_mysql_user').value = '';
            document.getElementById('db_mysql_password').value = '';
        } else if (type === 'oracle') {
            document.getElementById('db_oracle_tag').value = '';
            document.getElementById('db_oracle_url').value = '';
            document.getElementById('db_oracle_host').value = '';
            document.getElementById('db_oracle_port').value = '';
            document.getElementById('db_oracle_database').value = '';
            document.getElementById('db_oracle_user').value = '';
            document.getElementById('db_oracle_password').value = '';
        } else {
            return;
        }
    }

    function getMysqlDBFormData() {
        return {
            url: document.getElementById('db_mysql_url').value,
            tag: document.getElementById('db_mysql_tag').value,
            host: document.getElementById('db_mysql_host').value,
            port: document.getElementById('db_mysql_port').value,
            database: document.getElementById('db_mysql_database').value,
            user: document.getElementById('db_mysql_user').value,
            password: document.getElementById('db_mysql_password').value,
        }
    }


    function getOracleDBFormData() {
        return {
            url: document.getElementById('db_oracle_url').value,
            tag: document.getElementById('db_oracle_tag').value,
            host: document.getElementById('db_oracle_host').value,
            port: document.getElementById('db_oracle_port').value,
            sid: document.getElementById('db_oracle_sid').value,
            user: document.getElementById('db_oracle_user').value,
            password: document.getElementById('db_oracle_password').value,
        }
    }

    function urlDecode(type) {
        if (type === 'mysql') {

            let mysqlJdbc = document.getElementById('db_mysql_url').value;
            let matchGroups = mysqlJdbc.match(mysqlJdbcRegex);
            if (matchGroups.length === 0) {
                throw new Error("jdbc url错误");
            }
            console.log('匹配结果', matchGroups);
            document.getElementById('db_mysql_host').value = matchGroups[1];
            document.getElementById('db_mysql_port').value = matchGroups[2];
            document.getElementById('db_mysql_database').value = matchGroups[3];

            let parameters = matchGroups[5].split('&')
            let paramMap = {}
            if (parameters) {
                for (let param of parameters) {
                    let entry = param.split('=');
                    if (entry.length === 2) {
                        paramMap[entry[0]] = entry[1];
                    }
                }
            }
            document.getElementById('db_mysql_user').value = paramMap['user'];
            document.getElementById('db_mysql_password').value = paramMap['password'];
        } else if (type === 'oracle') {

            let oracleJdbc = document.getElementById('db_oracle_url').value
            let matchGroups = oracleJdbc.match(oracleJdbcRegex);
            if (matchGroups.length === 0) {
                throw new Error("jdbc url错误");
            }
            console.log('匹配结果', matchGroups);
            document.getElementById('db_oracle_host').value = matchGroups[1];
            document.getElementById('db_oracle_port').value = matchGroups[2];
            document.getElementById('db_oracle_sid').value = matchGroups[3];
        } else {
            throw new Error("不支持的数据库类型");
        }
    }

    function listDbEnv(type) {
        vscode.postMessage({
            command: 'listDbEnv',
            type: type
        });
    }

    // ~ ------------------------------------------------------------------------------------------------------------
    // 类型映射配置
    // ~ ------------------------------------------------------------------------------------------------------------
    function listDataType(type) {
        if (type !== 'mysql' && type !== 'oracle') {
            throw new Error("不支持的数据库类型");
        }
        vscode.postMessage({
            command: 'dataType',
            type: type
        });
    }

    function showColumnTypes(currentType) {
        return '<input type="text" class="form-control" placeholder="字段类型正则表达式" value="' + currentType + '">';
    }

    function showJavaTypes(currentType) {
        let javaTypes = ['java.lang.Boolean',
            'java.lang.Integer',
            'java.lang.Long',
            'java.math.BigDecimal',
            'java.util.Date',
            'java.lang.String'];

        let selectHtml = '<select class="form-select" aria-label="javaTypeSelector">'
        for (let javaType of javaTypes) {
            let flag = currentType === javaType ? 'selected' : '';
            let option = '<option value="' + javaType + '" ' + flag + '>' + javaType + '</option>';
            selectHtml = selectHtml + option;
        }
        selectHtml = selectHtml + '</select>';
        return selectHtml;
    }

    function addDataType() {
        console.log('addDataType');
        let tableType = document.getElementById('type-table');
        let x = tableType.insertRow();
        let cell = x.insertCell();
        cell.innerHTML = showColumnTypes('');
        cell = x.insertCell();
        cell.innerHTML = showJavaTypes('');
    }

    function saveDataType() {
        let type = 'mysql';
        document.getElementsByName('dbType').forEach(item => {
            if (item.checked) {
                type = item.value;
                return;
            }
        });
        let tableType = document.getElementById('type-table');
        let data = [];
        for (let index = 1; index < tableType.rows.length; index++) {
            let element = tableType.rows[index];
            let cellData = { columnType: '', javaType: '' };
            let columnType = element.cells[0].children[0].value;
            let javaType = element.cells[1].children[0].value;
            cellData.columnType = columnType;
            cellData.javaType = javaType;
            data.push(cellData);
        }

        console.log('saveDataType', type, data);
        vscode.postMessage({
            command: 'saveDataType',
            type: type,
            data: data
        });


    }

    // ~ ------------------------------------------------------------------------------------------------------------
    // 策略配置
    // ~ ------------------------------------------------------------------------------------------------------------

    function generateFile() {
        let type = 'mysql';
        document.getElementsByName('dbEnv').forEach(item => {
            if (item.checked) {
                type = item.value;
                return;
            }
        });

        let data = {
            projectPath: document.getElementById('projectPathId').value,
            entityPath: document.getElementById('entityPathId').value,
            interfacePath: document.getElementById('interfacePathId').value,
            xmlPath: document.getElementById('xmlPathId').value,
            type: type,
            tag: document.getElementById('dbEnvId').value,
            tableName: document.getElementById('tableNameId').value,
        }

        console.log('文件生成组装参数', data);

        vscode.postMessage({
            command: 'generateFile',
            type: type,
            data: data
        });


    }


</script>


`;
