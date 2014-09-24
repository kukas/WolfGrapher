%lex
%%

\s+                   /* skip whitespace */
[0-9]+("."[0-9]+)?\b  return 'NUMBER'
"**"                  return '^'
"^"                   return '^'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"("                   return '('
")"                   return ')'
/* pokročilé funkce */
"SQRT"                return 'SQRT'
"SIN"                 return 'SIN'
"ASIN"                return 'ASIN'
"COS"                 return 'COS'
"ACOS"                return 'ACOS'
"TAN"                 return 'TAN'
"ATAN"                return 'ATAN'
"LOG"                 return 'LOG'
/* nematematické */
"ABS"                 return 'ABS'
"CEIL"                return 'CEIL'
"ROUND"               return 'ROUND'
"FLOOR"               return 'FLOOR'
/* speciální proměnné */
"X"                   return 'X'
"T"                   return 'TIME'
"E"                   return 'E'
[A-Z]\b               return 'PARAMETER'
"RANDOM"              return 'RANDOM'
"PI"                  return 'PI'

<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : e '+' e
        {$$ = {
            type: "addition",
            arguments: [
                $1,
                $3
            ]
            };}
    | e '-' e
        {$$ = {
            type: "subtraction",
            arguments: [
                $1,
                $3
            ]
            };}
    | e '*' e
        {$$ = {
            type: "multiplication",
            arguments: [
                $1,
                $3
            ]
            };}
    | e '/' e
        {$$ = {
            type: "division",
            arguments: [
                $1,
                $3
            ]
            };}
    | e '^' e
        {$$ = {
            type: "power",
            arguments: [
                $1,
                $3
            ]
            };}
    | 'SQRT' '(' e ')'
        {$$ = {
            type: "power",
            arguments: [
                $3,
                0.5
            ]
            };}
    | 'SIN' '(' e ')'
        {$$ = {
            type: "sin",
            arguments: [
                $3
            ]
            };}
    | 'ASIN' '(' e ')'
        {$$ = {
            type: "asin",
            arguments: [
                $3
            ]
            };}
    | 'COS' '(' e ')'
        {$$ = {
            type: "cos",
            arguments: [
                $3
            ]
            };}
    | 'ACOS' '(' e ')'
        {$$ = {
            type: "acos",
            arguments: [
                $3
            ]
            };}
    | 'TAN' '(' e ')'
        {$$ = {
            type: "tan",
            arguments: [
                $3
            ]
            };}
    | 'ATAN' '(' e ')'
        {$$ = {
            type: "atan",
            arguments: [
                $3
            ]
            };}
    | 'LOG' '(' e ')'
        {$$ = {
            type: "log",
            arguments: [
                $3
            ]
            };}
    | 'LOG' '(' e ',' e ')'
        {$$ = {
            type: "division",
            arguments: [
                {
                type: "log",
                arguments: [
                    $3
                ]
                },
                {
                type: "log",
                arguments: [
                    $5
                ]
                }
            ]
            };}
    | 'ABS' '(' e ')'
        {$$ = {
            type: "abs",
            arguments: [
                $3
            ]
            };}
    | 'CEIL' '(' e ')'
        {$$ = {
            type: "ceil",
            arguments: [
                $3
            ]
            };}
    | 'ROUND' '(' e ')'
        {$$ = {
            type: "round",
            arguments: [
                $3
            ]
            };}
    | 'FLOOR' '(' e ')'
        {$$ = {
            type: "floor",
            arguments: [
                $3
            ]
            };}
    | 'RANDOM'
        {$$ = {
            type: "random",
            };}
    | 'TIME'
        {$$ = {
            type: "time",
            };}
    | 'PARAMETER'
        {$$ = {
            type: "parameter",
            value: $1
            };}
    | 'X'
        {$$ = {
            type: "x",
            };}
    | 'PI'
        {$$ = {
            type: "number",
            display: "π",
            value: Math.PI
            };}
    | 'E'
        {$$ = {
            type: "number",
            display: "e",
            value: Math.E
            };}
    | '-' e %prec UMINUS
        {$$ = {
            type: "negation",
            arguments: [
                $2
            ]
            };}
    | '(' e ')'
        {$$ = $2;}
    | NUMBER
        {$$ = {
            type: "number",
            value: parseFloat($1)
            };}
    ;
