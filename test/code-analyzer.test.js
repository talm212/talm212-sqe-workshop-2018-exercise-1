import assert from 'assert';
import {parseCode, jsonToHtmlTable} from '../src/js/code-analyzer';
import {addObject, modelToHtml, objToHtml, cleanModel} from '../src/js/Model';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });
});

describe('The model class', () => {

    it('is objToHtml work', () => {
        let obj = {
            line : 1,
            type : 'if statement',
            name : 'mid',
            condition : 'low <= high',
            value : -1
        };

        let objHtml = '<tr>' +
            '<td>'+obj.line+'</td>' +
            '<td>'+obj.type+'</td>' +
            '<td>'+obj.name+'</td>' +
            '<td>'+obj.condition+'</td>' +
            '<td>'+obj.value+'</td>' +
            '</tr>';

        assert.equal(
            objToHtml(obj),
            objHtml
        );
    });

    it('is parsing a simple variable declaration correctly', () => {

        addObject(1,'if statement', 'mid', 'low <= high', -1);
        addObject(2,'function declaration', 'n', '', '');

        let htmlans = '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>if statement</td><td>mid</td><td>low <= high</td><td>-1</td></tr><tr><td>2</td><td>function declaration</td><td>n</td><td></td><td></td></tr></tbody></table>'

        assert.equal(
            htmlans,
            modelToHtml()
        );
    });
});

function check(code){
    cleanModel();
    return jsonToHtmlTable(parseCode(code, true));
}

describe('The parseJson', () => {
    it('function', () => {

        assert.equal(
            check('function a(x){}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>function declaration</td><td>a</td><td></td><td></td></tr><tr><td>1</td><td>variable declaration</td><td>x</td><td></td><td></td></tr></tbody></table>'
        );
    });

    it('variable', () => {
        assert.equal(
            check('let a = 1;'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>variable declarator</td><td>a</td><td></td><td>1</td></tr></tbody></table>'
        );
    });

    it('for', () => {
        assert.equal(
            check('for(var i = 1; i < 3; i = i++){let a = 1;}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>for statement</td><td></td><td>i < 3</td><td></td></tr><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>1</td></tr><tr><td>1</td><td>assignment expression</td><td>i</td><td></td><td>i++</td></tr><tr><td>1</td><td>variable declarator</td><td>a</td><td></td><td>1</td></tr></tbody></table>'
        );
    });

    it('while', () => {
        assert.equal(
            check('while(i){i++}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>while statement</td><td></td><td>undefined undefined undefined</td><td></td></tr></tbody></table>'
        );
    });

    it('if', () => {
        assert.equal(
            check('if(x>1){let i = 1;}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>if statement</td><td></td><td>x > 1</td><td></td></tr><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>1</td></tr></tbody></table>'
        );
    });

    it('if else', () => {
        assert.equal(
            check('if(x>1){let i = 1;}else{let i = 2;}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>if statement</td><td></td><td>x > 1</td><td></td></tr><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>1</td></tr><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>2</td></tr></tbody></table>'
        );
    });

    it('if else if', () => {
        assert.equal(
            check('if(x>1){let i = 1;}else if(x <3){let i = 3;}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>if statement</td><td></td><td>x > 1</td><td></td></tr><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>1</td></tr><tr><td>1</td><td>else if statement</td><td></td><td>x < 3</td><td></td></tr><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>3</td></tr></tbody></table>'
        );
    });

    it('return', () => {
        assert.equal(
            check('function a(){return true;}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>function declaration</td><td>a</td><td></td><td></td></tr><tr><td>1</td><td>return statement</td><td></td><td></td><td>true</td></tr></tbody></table>'
        );
    });

    it('UnaryExpression', () => {
        assert.equal(
            check('if(typeof(i)==number){i=1;}'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>if statement</td><td></td><td>typeof i == number</td><td></td></tr></tbody></table>'
        );
    });

    it('MemberExpression', () => {
        assert.equal(
            check('let i = x[3];'),
            '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody><tr><td>1</td><td>variable declarator</td><td>i</td><td></td><td>x[3]</td></tr></tbody></table>');
    });
});