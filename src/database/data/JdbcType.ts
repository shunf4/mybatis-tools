class JdbcType extends Map<string, string> {

    constructor() {
        super();
        this.set("java.lang.Boolean", "TINYINT");
        this.set("java.lang.Integer", "INTEGER");
        this.set("java.lang.Long", "BIGINT");
        this.set("java.math.BigDecimal", "DECIMAL");
        this.set("java.util.Date", "TIMESTAMP");
        this.set("java.lang.String", "VARCHAR");
    }

}


export const jdbcTypeMap = new JdbcType();

