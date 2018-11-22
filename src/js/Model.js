
let Model = [];

const addObject = (line, type, name, condition, value) => {
    let obj = {
        line : line,
        type : type,
        name : name,
        condition : condition,
        value : value
    };

    Model.push(obj);
};

const objToHtml = (obj) => {
    return '<tr>' +
        '<td>'+obj.line+'</td>' +
        '<td>'+obj.type+'</td>' +
        '<td>'+obj.name+'</td>' +
        '<td>'+obj.condition+'</td>' +
        '<td>'+obj.value+'</td>' +
        '</tr>';
};

const modelToHtml = () => {
    let ans = '';

    for(var i=0;i<Model.length;i++){
        ans+=objToHtml(Model[i]);
    }
    return '<table border="1"><thead><tr>    <th>Line</th><th>Type</th><th>Name</th><th>Condition</th><th>Value</th></tr></thead><tbody>' + ans +'</tbody></table>';
};

const cleanModel = () => {

    Model = [];
};

export {addObject, modelToHtml, cleanModel, objToHtml};