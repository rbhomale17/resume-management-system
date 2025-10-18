/**
Utility functions for SQL operations.
Reusable helpers for working with SQL queries.
*/

function quote_ident(ident) {
    return `"${ident.replace(/"/g, '""')}"`;
}

function quote_literal(s) {
    return `'${s.replace(/'/g, "''")}'`;
}

module.exports = {
    quote_ident,
    quote_literal,
};
