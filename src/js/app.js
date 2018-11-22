import $ from 'jquery';
import {parseCode, jsonToHtmlTable} from './code-analyzer';
import {cleanModel} from './Model';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {

        cleanModel();

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let parsedCodeWithLoc = parseCode(codeToParse, true);

        $('#codeTable').empty();
        let htmlTable = jsonToHtmlTable(parsedCodeWithLoc);
        $('#codeTable').html(htmlTable);

        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

    });
});

