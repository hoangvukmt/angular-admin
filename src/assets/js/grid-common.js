let checkUI;
let checkUI2;
function editAgGrid(id) {
    let agTable = $("#" + id).find(".ag-table");
    $(agTable).find('span[ref="eMenu"]').click(function() {
        let popupFilter = $(agTable).find(".ag-menu");
        for (let i = 0; i < popupFilter.length; i++) {
            let popup = popupFilter[i];
            if ($(popup).is(":visible")) {
                $(popup).keydown(function() {
                    checkUI2 = setInterval(function(){
                        if ($(this).find('label[for="andId"]').length > 0) {
                            $(this).find('label[for="andId"]').html("かつ");
                            $(this).find('label[for="orId"]').html("または");
                            clearInterval(checkUI2);
                        }
                    }.bind(this), 50);
                });
                $(popup).click(function() {
                    checkUI = setInterval(function(){
                        if ($(this).find('label[for="andId"]').length > 0) {
                            $(this).find('label[for="andId"]').html("かつ");
                            $(this).find('label[for="orId"]').html("または");
                            clearInterval(checkUI);
                        }
                    }.bind(this), 50);
                });

                let applyButton = $(popup).find("#applyButton");
                $(applyButton).remove();
                let clearButton = $(popup).find("#clearButton");
                let btnFilter = $(popup).find("#cusFilter").length;
                if (btnFilter === 0) {
                    $(clearButton).parent().append("<button type=\"button\" id=\"cusFilter\" onclick=\"cusAgGridApplyFilter('" + id + "');\">適用</button>");
                }

                let filterNumber = $(popup).find(".ag-filter-number-to");
                if (filterNumber.length > 0) {
                    $(popup).find("input[type='text']").keyup(function() {
                        forceNumber(this);
                    });

                    $(popup).find("input[type='text']").change(function() {
                        $($(this).parent().parent().next()).find("input[type='text']").keyup(function() {
                            forceNumber(this);
                        });
                    });
                }
            }
        }
    });
}

function cusAgGridApplyFilter(id) {
    let agTable = $("#" + id).find(".ag-table");
    let popupFilter = $(agTable).find(".ag-menu");
    let param = {};
    for (let i = 0; i < popupFilter.length; i++) {
        let popup = popupFilter[i];
        if ($(popup).is(":visible")) {
            let bodyFilter = $(popup).find(".ag-filter-body-wrapper");
            let childrenDiv = $(bodyFilter).children();
            let condition1 = $(childrenDiv[0]).find("select").val();
            let value1;
            if (condition1 !== "inRange") {
                value1 = $(childrenDiv[1]).find("input").val();
            }
            else {
                value1 = [];
                value1.push($($(childrenDiv[1]).find("input")[0]).val());
                value1.push($($(childrenDiv[1]).find("input")[1]).val());
            }
            let operator = $(childrenDiv[2]).find('input[type="radio"]:checked').val();
            let condition2 = $(childrenDiv[2]).find("select").val();
            let value2;
            if (condition2 !== "inRange") {
                value2 = $(childrenDiv[2]).find('input[type="text"]').val();
                if (typeof value2 === "undefined") {
                    value2 = $(childrenDiv[2]).find('input[type="date"]').val();
                }
            }
            else {
                value2 = [];
                if ($(childrenDiv[2]).find('input[type="text"]').length > 0) {
                    value2.push($($(childrenDiv[2]).find('input[type="text"]')[0]).val());
                    value2.push($($(childrenDiv[2]).find('input[type="text"]')[1]).val());
                }
                else {
                    value2.push($($(childrenDiv[2]).find('input[type="date"]')[0]).val());
                    value2.push($($(childrenDiv[2]).find('input[type="date"]')[1]).val());
                }
            }
            param = {
                condition1: condition1,
                value1: value1,
                operator: operator,
                condition2: condition2,
                value2: value2
            }
            break;
        }
    }

    window[id].componentFn(param);
}

function forceNumber(el) {
    const strInput = $(el).val();
    let strOutput = "";
    const len = strInput.length;
    for (var i = 0; i < len; i++) {
    const str = strInput[i];
        switch (str) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                strOutput += str;
                break;
        }
    }
    
    $(el).val(strOutput);
}