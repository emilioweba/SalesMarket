// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function getPicture() {
        console.log('entrou!'); 
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

$(document).on('click', '.goingDetails', function () {  // user wants product details
    jsonGetProductByName("#details", "#allSalesProduct", localStorage.getItem($(this).children('#pName').text()), $(this).children('#pName').text(), '');

  
    //$('#divSocialMedia').css({
    //    'top': document.getElementsByClassName('imageDetailed').
    //});
});

function jsonGetProductByName(elementName, listview, itIsLocalStorage, productName, iLocalStorage) { //input search, going details, favorites
    $.getJSON("http://www.emilioweba.com/Products.svc/GetProduct/" + productName, function (data) {
        if (!listview.localeCompare("#allSalesProduct")) // going details
        {
            $(elementName).empty();
            $(elementName).append(htmlProductDetail(data, itIsLocalStorage)).ready(function () {
               
                $('#informationDetailed').css({
                    'margin-top': $('.imageDetailed').height()/3
                });

                $('#divSocialMedia').css({
                    'top': $('#productPrice').offset().top,
                    'margin-left': $('#informationDetailed').width() - $('#divSocialMedia').width()
                });

                $(listview).listview().listview('refresh');
            });
        }
        else if(!elementName.localeCompare("#favList")) // favorites page
        {
            $(elementName).append(htmlFavorites(data.GetProductResult[0].ID, data.GetProductResult[0].UrlImage,
                data.GetProductResult[0].Name, data.GetProductResult[0].Price, data.GetProductResult[0].Market));
        }
        else                                            // input search
        {         
            $(listview).empty();

            for (var i = 0; i < data.GetProductResult.length ; i++) {
                $(listview).append(htmlListView(data.GetProductResult[i].ID, data.GetProductResult[i].UrlImage,
                    data.GetProductResult[i].Name, data.GetProductResult[i].Price, data.GetProductResult[i].Market));

                $(listview).listview("refresh");
            }
        }
    }).success(function () {
        //    alert('success');
    })
    .fail(function () {
        alert('error');
    });
}

function jsonGetProductByID(elementName, listview, id, itIsLocalStorage) { //
    $.getJSON("http://www.emilioweba.com/Products.svc/GetProductByID/" + id, function (data) {
        $.each(data, function (key, val) {
            for (var i = 0; i < val.length ; i++) {
                $(elementName).empty();
                $(elementName).append(htmlProductDetail(val[i].ID, val[i].UrlImage, val[i].Name, val[i].Price, val[i].Market, itIsLocalStorage));
                $(listview).listview().listview('refresh');
            }
        });
    }).success(function () {
        //         alert('success');
    }).fail(function () {
        alert('error');
    });
};

function jsonAllProducts() { //initial page
    $.getJSON("http://www.emilioweba.com/Products.svc/GetAllSaleProducts", function (data) {
        $.each(data, function (key, val) {
            for (var i = 0; i < val.length ; i++) {

                $("#salesOfDay").append(htmlListView(val[i].ID, val[i].UrlImage, val[i].Name, val[i].Price, val[i].Market));
                $("#salesOfDay").listview("refresh");
            }
        });
    }).success(function () {
        //         alert('success');
    }).fail(function () {
        alert('error');
    });
};

function htmlProductDetail(data, itIsLocalStorage) {

    var newHTML = '<div id="divImageDetailed">';
    newHTML += '<img class="imageDetailed" src="http://www.emilioweba.com/' + data.GetProductResult[0].UrlImage + '" />';
    newHTML += '</div>';

    newHTML += '<div id="informationDetailed">';
    newHTML += '<div id="productName">' + data.GetProductResult[0].Name + '</div>';
    newHTML += '<div id="startingAt">starting at:</div>';
    newHTML += '<div id="productPrice"> $' + getCheapestPrice(data) + '</div>';
    newHTML += '<div id="divSocialMedia">';
    newHTML += '<a id="favoriteBtn">';

    if ($.isNumeric(itIsLocalStorage)) {
        newHTML += '<img id="imgFavorite" src="images/favorite.png" hidden/>';
        newHTML += '<img id="imgFavoriteFilled" src="images/heartFilled.png" />';
    } else {
        newHTML += '<img id="imgFavorite" src="images/favorite.png" />';
        newHTML += '<img id="imgFavoriteFilled" src="images/heartFilled.png" hidden />';
    }

    newHTML += '</a>';
    newHTML += '<a id="socialMediaBtn">';
    newHTML += '<img src="images/shareIcon.png" />';
    newHTML += '</a> </div> </div>';
    
    newHTML += '<div id="divListContent">';
    newHTML += '<ul id="allSalesProduct" data-role="listview" class="ui-nodisc-icon" data-icon="false">';

    for (var i = 0; i < data.GetProductResult.length ; i++) {

        newHTML += '<li>';
        newHTML += '<input type="hidden" id="productID" value="' + data.GetProductResult[i].ID + '" />';
        newHTML += '<a href="#" id="teste" data-transition="slidedown">';
        newHTML += htmlWithRightImage(data.GetProductResult[i].Market);
        newHTML += '<div class="productPriceDetails">$' + data.GetProductResult[i].Price + '</div>';
        newHTML += '</a> </li>';
    }

    newHTML += '</ul> </div>';
    
    return newHTML;
}

function htmlWithRightImage(image) {
    
    var imgClass = '';

    if (image.indexOf("aldi") != -1) {
        imgClass = 'image_detail_aldi';
    } else {
        imgClass = 'image_detail_wholefoods';
    } 
    //else if (image.indexOf("aldi") != -1) {
    //    return '<img class="image_detail_wholefoods" src="http://www.emilioweba.com/' + image + '" />';
    //} else if (image.indexOf("aldi") != -1) {
    //    return '<img class="image_detail_wholefoods" src="http://www.emilioweba.com/' + image + '" />';
    //} else if (image.indexOf("aldi") != -1) {
    //    return '<img class="image_detail_wholefoods" src="http://www.emilioweba.com/' + image + '" />';
    //} else 

    return '<img class="' + imgClass +'" src="http://www.emilioweba.com/' + image + '" />';
}


function getCheapestPrice(data) {

    var smallest = data.GetProductResult[0].Price;

    for (var i = 1; i < data.GetProductResult.length ; i++) {

        if (smallest > data.GetProductResult[i].Price)
            smallest = data.GetProductResult[i].Price;
    }

    return smallest;
}

$.fn.paddingTop = function () {
    // clone the interesting element
    // append it to body so that CSS can take effect
    var clonedElement = this.
        clone().
        appendTo(document.body);

    // get its height
    var innerHeight = clonedElement.
        innerHeight();

    // set its padding top to 0
    clonedElement.css("padding-top", "0");

    // get its new height
    var innerHeightWithoutTopPadding = clonedElement.
        innerHeight();

    // remove the clone from the body
    clonedElement.remove();

    // return the difference between the height with its padding and without its padding
    return innerHeight - innerHeightWithoutTopPadding;

};

function htmlListView(id, img, name, price, marketImg) {

    var newHtml = '<li> <a href="#productContent" class="goingDetails" data-transition="slide"> ';
    newHtml += '<img src= "http://www.emilioweba.com/' + img + '" />';
    newHtml += '<input type="hidden" id="productID" value="' + id + '"/>';
    newHtml += '<label id="pName">' + name + '</label>';
    newHtml += '<h3 id="pPrice">$' + price + '</h3> ';
    if (marketImg.indexOf("aldi") != -1)
    {
        newHtml += '<span class="lvIcon_aldi"> <img class="image_aldi" src="http://www.emilioweba.com/' + marketImg + '" /> </span> </a> </li>';
    }
    else if (marketImg.indexOf("whole_foods") != -1)
    {
        newHtml += '<span class="lvIcon_wholefoods"> <img class="image_wholefoods" src="http://www.emilioweba.com/' + marketImg + '" /> </span> </a> </li>';
    }
    else if (marketImg.indexOf("walmart") != -1) {
        newHtml += '<span class="lvIcon_walmart"> <img class="image_walmart" src="http://www.emilioweba.com/' + marketImg + '" /> </span> </a> </li>';
    }
    else if (marketImg.indexOf("mariano") != -1) {
        newHtml += '<span class="lvIcon_marianos"> <img class="image_marianos" src="http://www.emilioweba.com/' + marketImg + '" /> </span> </a> </li>';
    }
    else
    {
        newHtml += '<span class="lvIcon"> <img class="image" src="http://www.emilioweba.com/' + marketImg + '" /> </span> </a> </li>';
    }
    
    return newHtml;
}

$(document).bind('pageinit', function (event) {

    if (!$('html').hasClass("mv-on")) {
        $('html').addClass("mv-on");
        
        jsonAllProducts();
    }

    //var rect = element.getBoundingClientRect();
    //console.log(rect.top, rect.right, rect.bottom, rect.left);
    
   

});

$(document).on('pagebeforeshow', '#home', function (e, data) {

    $('#homePageSearch').on("keypress", function (e) {  // input search

        if (e.which == 13) {
            jsonGetProductByName('', '#salesOfDay', '', $(this).val(), '');
        }
    });
});

/* Start - Calculates the height of the navpanel, so the Header can appear */

function getPanelHeight(element, bool)
{
    if(bool){
        var header = $(element).outerHeight() * 0.5;
    } else {
        var header = $(element).outerHeight() - 1;
    }
    var panel = $('.ui-panel').height();
    var panelheight = panel - header;
    $('.ui-panel').css({
        'top': header,
        'min-height': panelheight
    });

    return panelheight;
};

/* End - Calculates the height of the navpanel, so the Header can appear */

/* Start - Clear button of search input */

$(document).on('click', '.ui-input-clear', function () {
    $("ul").empty();
    jsonAllProducts();
});

/* End - Clear button of search input */

/* Start - Makes main page darken */

function toogleShadow(shadowRelated, shadowHeaderRelated)
{
    $(shadowRelated).toggle();
    $(shadowHeaderRelated).toggle();
    if ($(shadowRelated).is(":hidden")) {
        $(this).removeClass("turnedOff");

    } else {
        $(this).addClass("turnedOff");
    }
}

function navPanel(navPanelName, pageRelated, shadowRelated, shadowHeaderRelated, cutHeader) {
    getPanelHeight(navPanelName, cutHeader);

    $(shadowRelated).css("height", $(pageRelated).height() + $(pageRelated).paddingTop()).hide();
    if (cutHeader) {
        $(shadowHeaderRelated).css("height", $('[data-role=header]').outerHeight() * 0.5 - 1).hide();
        $(shadowHeaderRelated).css("top", $('[data-role=header]').outerHeight() * 0.5).hide();
    }

    toogleShadow(shadowRelated, shadowHeaderRelated);
}

/*    navpanel home page    */

$("#navpanel").panel({
    beforeopen: function (event, ui) {
        navPanel('#home #header', '#home', '#shadow', '#shadow_header', true);
    },
    beforeclose: function (event, ui) {
        toogleShadow('#shadow', '#shadow_header');
     }
});

/*    navpanel product detail page    */

$("#navpanel1").panel({
    beforeopen: function (event, ui) {
        navPanel('#productContent #header', '#productContent', '#productContent #shadow', false);
    },
    beforeclose: function (event, ui) {
        toogleShadow('#productContent #shadow', '');
    }
});

/*    navpanel favorite page    */

$("#navpanel2").panel({
    beforeopen: function (event, ui) {
        navPanel('#favoritePage #header', '#favoritePage', '#favoritePage #shadow', false);
    },
    beforeclose: function (event, ui) {
        toogleShadow('#favoritePage #shadow', '');
    }
});

/* End - Makes main page darken */
$(document).on('click', '#socialMediaBtn', function () {
    var message = "Check out this amazing sale! " + document.getElementById("productDescription").innerHTML + " Price: " + document.getElementById("productPrice").innerHTML
    window.plugins.socialsharing.share(message , null, 'http://www.emilioweba.com/imagesSalesMarket/banana.jpg', null);
});

//$("#socialMediaBtn").click(function () {
//    window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Message via Facebook', 'http://www.emilioweba.com/imagesSalesMarket/banana.jpg', null /* url */, 'Paste it dude!',
//    function () { console.log('share ok') }, function (errormsg) { alert(errormsg) })
//});

$(document).on('click', '#favoriteBtn', function () {

    $("#favAdd").hide();
    $("#favRem").hide();

    if ($("#imgFavorite").is(":visible")) {
        localStorage.setItem($(this).parent().siblings('#productName').text(), $(this).parent().siblings('#productPrice').text().replace('$','')); //record the name and price
       
        $("#favAdd").fadeIn();
        $("#footerDetails").fadeIn();
        $(this).parent().siblings('#productPrice').te
        setTimeout(function () { $("#favAdd").fadeOut(); }, 2000);
        setTimeout(function () { $("#footerDetails").fadeOut(); }, 2000);
    } else {
        localStorage.removeItem($(this).parent().siblings('#productName').text()); //remove the hidden field name

        $("#favRem").fadeIn();
        $("#footerDetails").fadeIn();

        setTimeout(function () { $("#favRem").fadeOut(); }, 2000);
        setTimeout(function () { $("#footerDetails").fadeOut(); }, 2000);
    }

    $("#imgFavorite").toggle();   // hide or show
    $("#imgFavoriteFilled").toggle(); // show or hide
    
});

$("#closePanel").click(function () {
    $( "#navpanel" ).panel( "close" );
});

$("#closePanel1").click(function () {
    $("#navpanel2").panel("close");
});

$(document).on('click', '.favorites', function () { // user wants details of his favorite
    
    jsonGetProductByName("#details", "#allSalesProduct", localStorage.getItem($(this).children().find('#productDescription').text()), $(this).children().find('#productDescription').text(), '');

    window.location.href = "#productContent"
});

$('.favoritePage').click(function (){
    
    $("#favList").empty();
    var localKeys = Object.keys(localStorage);
    
    for (var i = 0; i < localStorage.length; i++)
    {
        if (TryParseInt(localStorage.getItem(localKeys[i]), false)) // list of favorites
        {
            jsonGetProductByName("#favList", '', '', localKeys[i], i)
        }
    }
});

function htmlFavorites(id, img, name, price, marketImg) {

    var newHtml = '<div class="favorites">';
    newHtml += '<div class="divImageDetailed">';
    newHtml += '<img class="imageDetailed" src="http://www.emilioweba.com/' + img + '" />';
    newHtml += '</div>';
    newHtml += '<div class="informationDetailed">';
    newHtml += '<input type="hidden" id="productID" value="' + id + '" />';
    newHtml += '<div id="productDescription">' + name + '</div>';
    newHtml += '<div id="startingAt">starting at:</div>';
    newHtml += '<div id="productPrice">$' + price + '</div>';
    newHtml += '</div> </div>';
                
    return newHtml;
}

function TryParseInt(str, defaultValue) {
    var retValue = defaultValue;
    if (str !== null) {
        if (str.length > 0) {
            if (!isNaN(str)) {
                return true;
            }
        }
    }
    return retValue;
}

$('#teste').click(function () {
    localStorage.clear();
});