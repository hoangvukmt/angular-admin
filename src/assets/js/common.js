function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = $(".tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = $(".tab-links");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    $(evt.currentTarget).addClass("active");
}
function collapseContent(el) {
    let parent = $(el).parent().parent();
    $(parent).find(".crop-content").toggle(100);
    $(parent).find(".full-content").toggle(100);
    $(el).toggleClass("fa-chevron-down");
    $(el).toggleClass("fa-chevron-up");
}
function changeDateClick(divId) {
    let divDate = $("#" + divId);
    $(divDate).find("mat-datepicker-toggle").find("button").click();
}
function previewImage(idInput) {
    let filePreview = $("#" + idInput)[0].files[0];
    const fileSize = filePreview.size/1024/1024;
    if (fileSize <= 5) {
        if (filePreview.name.match(/\.(pdf)$/)) {
            $('#previewImage').attr('src', $("#" + idInput).attr('title') + 'assets/img/pdf.png');
        }
        else {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#previewImage').attr('src', e.target.result);
            }
            reader.readAsDataURL(filePreview);
        }
    }
}
function loadImage(imgId, filePreview, rootUrl) {
    if (filePreview.name.match(/\.(pdf)$/)) {
        $(imgId).attr('src', rootUrl + 'assets/img/pdf.png');
    }
    else {
        var reader = new FileReader();
        reader.onload = function(e) {
            $(imgId).attr('src', e.target.result);
        }
        reader.readAsDataURL(filePreview);
    }
}
function editMatDate(cpn, dateInput) {
    setTimeout(function() {
        $("mat-calendar").append(
            '<div class="mat-calendar-clear"><button type="button" class="btn-red float-right" onclick="clearMatDate(' + cpn + ', \'' + dateInput + '\');">Clear</button></div>'
        );
    }, 50);
}
function clearMatDate(cpn, dateInput) {
    cpn.matClearDateFn(dateInput);
}
function changeClickToEl(elId) {
    $("#" + elId).click();
}
var isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
var EXIF;
function imageLoad(el) {
    EXIF.getData(el, function () {
        orientation = EXIF.getTag(this, 'Orientation');
        if(!isIphone) {       
            if(orientation === 3) {
                $(el).addClass('rotate180');
            }else if(orientation === 6) {
                $(el).addClass('rotate90');
            }else if(orientation === 8) {
                $(el).addClass('rotate270');
            }
        }
    });
}
function addValueToNext(el) {
    $(el).next().val($(el).val());
}

var _forceHalfSize;
function forceKatakana() {
  forceHalfSizeKatakana(event, $('.half-size')[0], 30);
  _forceHalfSize = setTimeout(forceKatakana, 100);
}
function stopForceKatakana() {
  clearTimeout(_forceHalfSize);
}

function forceHalfSizeKatakana(e, el, _maxlength) {
    if (typeof el !== "undefined") {
      const strInput = $(el).val();
      let strOutput = "";
      
      const len = strInput.length > _maxlength ? _maxlength : strInput.length;
      for (var i = 0; i < len; i++) {
        const str = strInput[i];
        if (
          //half size 0123456789
          str === "0" || str === "1" || str === "2" || str === "3" || str === "4" || str === "5" || str === "6" || str === "7" || str === "8" || str === "9" ||
          str === "q" || str === "w" || str === "e" || str === "r" || str === "t" || str === "y" || str === "u" || str === "i" || str === "o" || str === "p" ||
          str === "a" || str === "s" || str === "d" || str === "f" || str === "g" || str === "h" || str === "j" || str === "k" || str === "l" ||
          str === "z" || str === "x" || str === "c" || str === "v" || str === "b" || str === "n" || str === "m" ||
          str === "Q" || str === "W" || str === "E" || str === "R" || str === "T" || str === "Y" || str === "U" || str === "I" || str === "O" || str === "P" ||
          str === "A" || str === "S" || str === "D" || str === "F" || str === "G" || str === "H" || str === "J" || str === "K" || str === "L" ||
          str === "Z" || str === "X" || str === "C" || str === "V" || str === "B" || str === "N" || str === "M" ||
          //full size str === "０" || str === "１" || str === "２" || str === "３" || str === "４" || str === "５" || str === "６" || str === "７" || str === "８" || str === "９" ||
          //full size str === "ｑ" || str === "ｗ" || str === "ｒ" || str === "ｔ" || str === "ｙ" || str === "ｐ" || str === "ｓ" || str === "ｄ" || str === "ｆ" || str === "ｇ" || str === "ｈ" || str === "ｊ" || str === "ｋ" || str === "ｌ" || str === "ｚ" || str === "ｘ" || str === "ｃ" || str === "ｖ" || str === "ｂ" || str === "ｍ" ||
          //full size /^([ァ-ヶー]+)$/.test(str) ||
          /^([ｱ-ﾝﾞﾟ]+)$/.test(str)
        ) {
          strOutput += str;
        }
      }
      
      $(el).val(strOutput);
    }
}
function forceHalfSizeNumber(e, el, _maxlength) {
    if (typeof el !== "undefined") {
        const strInput = $(el).val();
        let strOutput = "";
        
        const len = strInput.length > _maxlength ? _maxlength : strInput.length;
        for (var i = 0; i < len; i++) {
        const str = strInput[i];
        if (str === "0" || str === "1" || str === "2" || str === "3" || str === "4" || str === "5" || str === "6" || str === "7" || str === "8" || str === "9") {
            strOutput += str;
        }
        }
        
        $(el).val(strOutput);
    }
}
function onlyNumber(e, el, _maxlength) {
    const strInput = $(el).val();
    let strOutput = "";
    if (strInput === "" && e.keyCode !== 8){
        strOutput = $(el).next().val();
    }
    else {
        const len = strInput.length > _maxlength ? _maxlength : strInput.length;
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
    }
    if (strOutput.length > 0) {
        strOutput = parseFloat(strOutput);
    }
    $(el).val(strOutput);
}
function forceNumberPhone(e, el, _maxlength) {
    const strInput = $(el).val();
    let strOutput = "";
    if (strInput === "" && e.keyCode !== 8){
        strOutput = $(el).next().val();
    }
    else {
        const len = strInput.length > _maxlength ? _maxlength : strInput.length;
        for (var i = 0; i < len; i++) {
        const str = strInput[i];
        switch (str) {
            case "-":
            case "(":
            case ")":
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
    }
    $(el).val(strOutput);
}

var _forceHalfSizeNumber;
function forceKatakanaNumber() {
    forceHalfSizeNumber(event, $('.number-half-size')[0], 30);
    _forceHalfSizeNumber = setTimeout(forceKatakanaNumber, 100);
}
function stopForceKatakanaNumber() {
    clearTimeout(_forceHalfSizeNumber);
}

function collapseTokuyaku(el) {
    $(el).toggleClass("fa-angle-down");
    $(el).toggleClass("fa-angle-up");
    let _parent = $(el).parent().parent();
    let _tokuyakus = $(_parent).next();
    $(_tokuyakus).toggle();

    setTimeout(function() {
        let checkRegions = $('.checkRegion');
        for (let j = 0; j < checkRegions.length; j++) {
            let checkRegion = checkRegions[j];
            let regionItem = $(checkRegion).find('.form-row');
            for (let i = 0; i < regionItem.length; i++) {
                let item = regionItem[i];
                let rowContent = $(item).find('.row-content');
                let rowTitle = $(rowContent).find('.row-title');
                let rowValue = $(rowContent).find('.row-value');
                if (($(rowTitle).width() + $(rowValue).width()) > $(rowContent).width()) {
                    $(rowValue).css("float", "left");
                }
                else {
                    $(rowValue).css("float", "right");
                }
            }
        }
    }, 500);
}