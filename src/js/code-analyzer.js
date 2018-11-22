import * as esprima from 'esprima';
import {addObject, modelToHtml} from './Model';
import {generate} from 'escodegen';

const parseCode = (codeToParse, loc) => {
    let parsedCode = esprima.parseScript(codeToParse, {loc: loc});
    return parsedCode;
};

const parseJson = (jsonToParse) => {
    let ans;

    if (!jsonToParse)
        return jsonToParse;

    switch (jsonToParse.type) {
    case 'Literal': ans = literal(jsonToParse); break;
    case 'Identifier': ans = identifier(jsonToParse); break;
    case 'BinaryExpression': ans = generate(jsonToParse); break;
    case 'UnaryExpression': ans = generate(jsonToParse); break;
    case 'VariableDeclarator': ans = variableDeclarator(jsonToParse); break;
    case 'ReturnStatement': ans = returnStmt(jsonToParse); break;
    case 'MemberExpression': ans = generate(jsonToParse); break;
    case 'ExpressionStatement': ans = generate(jsonToParse); break;
    case 'AssignmentExpression': ans = assignExp(jsonToParse); break;
    case 'UpdateExpression': ans = generate(jsonToParse); break;
    case 'FunctionDeclaration': ans = funcDecl(jsonToParse); break;
    case 'VariableDeclaration': ans = variableDeclaration(jsonToParse); break;
    case 'BlockStatement': ans = blockStmt(jsonToParse); break;
    case 'IfStatement': ans = ifStmt(jsonToParse); break;
    case 'WhileStatement': ans = whileStmt(jsonToParse); break;
    case 'ForStatement': ans = forStmt(jsonToParse); break;
    case 'Program': ans = program(jsonToParse); break;
    }

    return ans;
};

const mapName = (name) => {
    let names = {
        'VariableDeclarator': 'variable declarator' ,
        'ReturnStatement': 'return statement' ,
        'AssignmentExpression': 'assignment expression' ,
        'UpdateExpression': 'update expression',
        'FunctionDeclaration': 'function declaration' ,
        'VariableDeclaration': 'variable declaration' ,
        'Identifier': 'variable declaration' ,
        'IfStatement': 'if statement' ,
        'WhileStatement': 'while statement',
        'ForStatement': 'for statement',
    };

    return names[name];
};

const literal = (jsonToParse) => {
    return jsonToParse.value;
};

const identifier = (jsonToParse) => {
    return jsonToParse.name;
};

const variableDeclarator = (jsonToParse) => {

    addObject(jsonToParse.loc.start.line, mapName(jsonToParse.type), parseJson(jsonToParse.id), '',parseJson(jsonToParse.init));
};

const returnStmt = (jsonToParse) => {
    addObject(jsonToParse.loc.start.line, mapName(jsonToParse.type), '', '',parseJson(jsonToParse.argument));
};

const assignExp = (jsonToParse) => {
    addObject(jsonToParse.loc.start.line, mapName(jsonToParse.type), parseJson(jsonToParse.left), '',parseJson(jsonToParse.right));
};

const variableDeclaration = (jsonToParse) => {
    for (let i = 0; i < jsonToParse.declarations.length; i++) {
        parseJson(jsonToParse.declarations[i]);
    }
};

const program = (jsonToParse) => {
    for (let i = 0; i < jsonToParse.body.length; i++) {
        parseJson(jsonToParse.body[i]);
    }
};

const forStmt = (jsonToParse) => {
    addObject(jsonToParse.loc.start.line, mapName(jsonToParse.type), '',parseJson(jsonToParse.test),'');

    parseJson(jsonToParse.init);
    parseJson(jsonToParse.update);
    parseJson(jsonToParse.body);
};

const whileStmt = (jsonToParse) => {
    let condition = parseJson(jsonToParse.test.left) + ' ' + jsonToParse.test.operator + ' ' + parseJson(jsonToParse.test.right);

    addObject(jsonToParse.loc.start.line, mapName(jsonToParse.type), '',condition,'');
    parseJson(jsonToParse.body);
};

const ifStmt = (jsonToParse, inElse) => {

    let condition = parseJson(jsonToParse.test.left) + ' ' + jsonToParse.test.operator + ' ' + parseJson(jsonToParse.test.right);

    let type = mapName(jsonToParse.type);
    if(inElse) type = 'else if statement';

    addObject(jsonToParse.loc.start.line,type,'',condition,'');

    parseJson(jsonToParse.consequent);

    if(jsonToParse.alternate && jsonToParse.alternate.type  === jsonToParse.type)
        ifStmt(jsonToParse.alternate, true );
    else
        parseJson(jsonToParse.alternate);
};

const blockStmt = (jsonToParse) => {
    for (let i = 0; i < jsonToParse.body.length; i++) {
        parseJson(jsonToParse.body[i]);
    }
};

const funcDecl = (jsonToParse) => {

    addObject(jsonToParse.loc.start.line, mapName(jsonToParse.type), parseJson(jsonToParse.id), '','');

    for (let i = 0; i < jsonToParse.params.length; i++) {
        addObject(jsonToParse.params[i].loc.start.line, mapName(jsonToParse.params[i].type), parseJson(jsonToParse.params[i]), '','');
    }

    parseJson(jsonToParse.body);
};


const jsonToHtmlTable = (jsonToParse) => {

    parseJson(jsonToParse);

    return modelToHtml();
};

export {parseCode, jsonToHtmlTable};
