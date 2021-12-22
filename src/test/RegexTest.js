let NAME = "[\\u00C0-\\u02B8a-zA-Z_$][\\u00C0-\\u02B8a-zA-Z_$0-9]";

let str = 'public static final void getUserInfo(@Param("name")String name);\n'+

'List<String> listUserInfo  (@Param("name")String name);\n'+

'public void \n'+
'getUserInfogetUserInfogetUserInfogetUserInfo(@Param("name")String name, UserInfo user, @Param("status") String status);\n'+

'default void getUser() {\n'+
'}';
let result = /(?<=\s+)(\w+)(?=\s*\()/mg.exec(str);


let PATTERN_ABSTRACT_METHOD_NAME = eval(`\/(?<=\\s+)(${NAME}+)(?=\\s*\\()\/`);
// look for "Hello"
let result1 = PATTERN_ABSTRACT_METHOD_NAME.exec(str);

// look for "W3Schools"
let result2 = PATTERN_ABSTRACT_METHOD_NAME.exec(str);

