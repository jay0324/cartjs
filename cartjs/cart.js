//simple cart.js
//coder: JH
//date: 2016/09/09

(function ($, document, window) {
    $.simplecart = function(options) {
        //make img with enlarge formate
        var defaults = {
            mode: "cart",
            debug: false,
            storageType: "session",
            storageName: "simplestorage",
            checkoutUrl: "checkout.html",
            format: 'json',
            tmp: {}
        };
        options = $.extend(defaults, options);

        //setup storage
        var mode = options.mode;
        var debug = options.debug;
        var storageType = options.storageType;
        var storageName = options.storageName;
        var checkoutUrl = options.checkoutUrl;
        var format = options.format;
        var tmp = options.tmp;
        var tmpDefault = {
                "quantity": '數量',
                "currency": '$',
                "price": '價格',
                "no": '編號',
                "name": '品名',
                "clearCartBtn": '全部清空',
                "submitBtn": "訂購",
                "deleteBtn": '<span class="icon-trash"></span> 刪除',
                "no-item": "目前尚無任何項目!",
                "tmpString1": '詢問 {var1} 項商品, 共 {var2} 件 / 總金額 {var3}',
                "tmpString2": '詢問 {var1} 項商品, 共 {var2} 件',
                "tmpString3": '<span class="icon-envelope"></span> 送出詢問函</span>',
                "tmpString4": '<span class="icon-shopping-cart"></span> 結帳 (總計 {var1})',
                "tmpString5": '{var1} 結帳',
                "tmpString6": '送出詢問函',
                "custom-submit-msg": '品名: {name} 數量: {quantity} 價格: {price||format_price} \n'
            };


        fnInitCart();

        $(document).on('click', '.inquiry_btn', function(){

            if ($(this).hasClass("active")) {
                fnRemoveFromCart($(this));
            }else{
                fnAddToCart($(this));
            }

            return false;
        })

        $(document).on('click','.delete_btn', function(){
            fnRemoveFromCart($(this));
            return false;
        })

        $(document).on('change','.pro-quantity-field',function(){

            fnUpdateField($(this));
            
            return false;
        })

        $(document).on('click','.expend_btn',function(){
            fnToggleCart($(this),'');
            return false;
        })

        $(document).on('click','.clearAll_btn',function(){
            fnClearCart();
            return false;
        })

        /*init cart*/
        function fnInitCart(){
            $("body").append('<div id="cart">');

            if ($(window).width() >= 400) {
               $("#cart").css({
                    width: '250px'
                }) 
            }else{
                $("#cart").css({
                    width: '98%'
                })
            }
            
            var currentList = fnGetData();
            fnUpdateCart(currentList);
            fnCheckInList();

        }

        /*get Tmp extension*/
        function fnGetTmpExt(key){
            if (tmp[key] != undefined) {
                return tmp[key];
            }else{
                return tmpDefault[key];
            }
        } 

        /*tmp*/
        function fnApplyTmp(tmp,obj){
            var output = tmp;
            for (var k in obj) {
                
                //replace value with price format
                output = output.replace("{"+k+"||format_price}", fnPriceFormat(obj[k], fnGetTmpExt('currency')));

                //set value without any action
                output = output.replace("{"+k+"}", obj[k]);
                
            }
            return output;
        } 

        /* price formate*/
        function fnPriceFormat(number,icon){
            number = parseInt(number).toFixed(2) + '';
                    x = number.split('.');
                    x1 = x[0];
                    x2 = x.length > 1 ? '.' + x[1] : '';
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                    }
                    //return x1 + x2; //return with floating
                    return icon+x1; //return without floating
        }  

        /*price sum*/
        function fnGetSum(price,qty) {
            return fnPriceFormat(parseInt(price) * parseInt(qty), fnGetTmpExt('currency'));
        }

        /*price total*/
        function fnGetTotal(){
            var currentList = fnGetData();
            var total = 0;
            for (var i = 0; i < currentList.length; i++) {
                total += parseInt(currentList[i]['price']) * parseInt(currentList[i]['quantity']);
            }
            return fnPriceFormat(total, fnGetTmpExt('currency'));
        }

        /*quantity total*/
        function fnGetTotalAmt(){
            var currentList = fnGetData();
            var total = 0;
            for (var i = 0; i < currentList.length; i++) {
                total += parseInt(currentList[i]['quantity']);
            }
            return total;
        }

        /*get list as string*/
        function fnGetListStr(){
            switch(storageType) {
                case 'local':
                    return currentList = (localStorage.getItem(storageName) == undefined) ? '[]' : localStorage.getItem(storageName);
                break;
                default:
                     return currentList = (sessionStorage.getItem(storageName) == undefined) ? '[]' : sessionStorage.getItem(storageName);
                break;
            }
        }

        /*get data*/
        function fnGetData(){
            switch(storageType) {
                case 'local':
                    return currentList = (localStorage.getItem(storageName) == undefined) ? [] : $.parseJSON(localStorage.getItem(storageName));
                break;
                default:
                    return currentList = (sessionStorage.getItem(storageName) == undefined) ? [] : $.parseJSON(sessionStorage.getItem(storageName));
                break;
            }
        }

        /*add to Cart*/
        function fnAddToCart(target){
            var currentList = fnGetData();
            var no = $(target).attr("pro-no");
            var name = $(target).attr("pro-name");
            var price = $(target).attr("pro-price");
            var quantity = $(".pro-quantity-field[pro-no='"+no+"']").val();
            var updateList = [];
            var addnew = {
                "no": no,
                "name": name,
                "quantity": quantity,
                "price": price
            };

            for (var i = 0; i < currentList.length; i++) {
                if (currentList[i]['no'] != no) {
                    updateList.push(currentList[i]);
                }
            }

            updateList.push(addnew);

            switch(storageType) {
                case 'local':
                    localStorage.setItem(storageName, JSON.stringify(updateList));
                break;
                default:
                    sessionStorage.setItem(storageName, JSON.stringify(updateList));
                break;
            }

            fnUpdateCart(updateList);
        }

        /*remove from Cart*/
        function fnRemoveFromCart(target){
            var currentList = fnGetData();
            var no = $(target).attr("pro-no");
            var updateList = [];
            for (var i = 0; i < currentList.length; i++) {
                if (currentList[i]['no'] != no) {
                    updateList.push(currentList[i]);
                }
            }

            switch(storageType) {
                case 'local':
                    localStorage.setItem(storageName, JSON.stringify(updateList));
                break;
                default:
                    sessionStorage.setItem(storageName, JSON.stringify(updateList));
                break;
            }

            fnUpdateCart(updateList);
        }

        //Clear Cart
        function fnClearCart(){
            switch(storageType) {
                case 'local':
                    localStorage.removeItem(storageName);
                break;
                default:
                    sessionStorage.removeItem(storageName);
                break;
            }

            fnUpdateCart(fnGetData());
        }

        /*update field*/
        function fnUpdateField(target){
            var currentList = fnGetData();
            var no = $(target).attr("pro-no");
            var quantity = $(target).val();
            var updateList = [];
            for (var i = 0; i < currentList.length; i++) {
                if (currentList[i]['no'] == no) {
                    var updateField = {
                        "no": currentList[i]['no'],
                        "name": currentList[i]['name'],
                        "quantity": quantity,
                        "price": currentList[i]['price']
                    };
                    updateList.push(updateField);
                }else{
                    updateList.push(currentList[i]);
                }
            }

            switch(storageType) {
                case 'local':
                    localStorage.setItem(storageName, JSON.stringify(updateList));
                break;
                default:
                    sessionStorage.setItem(storageName, JSON.stringify(updateList));
                break;
            }

            fnUpdateCart(updateList);
        }

        /*toggle cart*/
        function fnToggleCart(target,$state){
            switch ($state) {
                case 'clear':
                    //console.log('clear');
                    var setW = ($(window).width() >= 400) ? '400px' : '98%';
                    $("body").css({'padding-bottom':'0'});
                    $("#cart").fadeOut(50);
                    $("#cart .list-wrapper,#cart .clearAll_btn").hide();
                    $("#cart .expend_btn").html('<span class="icon-chevron-up"></span>').removeClass("active");
                break;
                case 'restart':
                    //console.log('restart');
                    $("#cart").show();
                    if ($(window).width() < 400) {
                        $("body").css({'padding-bottom':'46px'});
                    }
                    if ($("#cart .expend_btn").hasClass("active")) {
                        var setW = ($(window).width() >= 400) ? '400px' : '98%';
                        $("#cart").animate({'width':setW,'height':'99%'},200);
                        $("#cart .list-wrapper,#cart .clearAll_btn").show();
                        $("#cart .expend_btn").html('<span class="icon-chevron-down"></span>').addClass("active");
                    }else{
                        var setW = ($(window).width() >= 400) ? '250px' : '98%';
                        $("#cart").css({'width':setW,'height':'auto'});
                        $("#cart .list-wrapper,#cart .clearAll_btn").hide();
                        $("#cart .expend_btn").html('<span class="icon-chevron-up"></span>').removeClass("active");
                    }
                break;
                default:
                    //console.log('default');
                    if ($(target).hasClass("active")) {
                        var setW = ($(window).width() >= 400) ? '250px' : '98%';
                        $("#cart").css({'width':setW,'height':'auto'});
                        $("#cart .list-wrapper,#cart .clearAll_btn").hide();
                        $("#cart .expend_btn").html('<span class="icon-chevron-up"></span>').removeClass("active");
                    }else{
                        var setW = ($(window).width() >= 400) ? '400px' : '98%';
                        $("#cart").animate({'width':setW,'height':'99%'},200);
                        $("#cart .list-wrapper,#cart .clearAll_btn").show();
                        $("#cart .expend_btn").html('<span class="icon-chevron-down"></span>').addClass("active");
                    }
                break;
            }
            
        }

        /*check the item is in the list*/
        function fnCheckInList(){
            var currentList = fnGetData();
            $(".inquiry_btn").removeClass("active").text(fnGetTmpExt('submitBtn'));
            $(".inquiry_btn").each(function(){
                var no = $(this).attr("pro-no");
                for (var i = 0; i < currentList.length; i++) {
                    if (currentList[i]['no'] == no) {
                        $(this).addClass("active").html(fnGetTmpExt('deleteBtn'));
                        $(".pro-quantity-field[pro-no='"+currentList[i]['no']+"']").val(currentList[i]['quantity']);
                    }
                }
            })
        }

        /*update cart*/
        function fnUpdateCart(data){

            /* check mode for ui */ 
            if (mode == 'cart') {
                //cart mode
                var checkout_btn = fnApplyTmp(fnGetTmpExt('tmpString4'), {
                                            'var1': fnGetTotal()
                                        });
                var checkout_btn_res = fnApplyTmp(fnGetTmpExt('tmpString5'),{
                                            'var1': fnGetTotal()
                                        });
                var inquiries_block_note = fnApplyTmp(fnGetTmpExt('tmpString1'),{
                                            'var1': data.length,
                                            'var2': fnGetTotalAmt(),
                                            'var3': fnGetTotal()
                                           });
            }else{
                //default mode
                var checkout_btn = fnGetTmpExt('tmpString3');
                var checkout_btn_res = fnGetTmpExt('tmpString6');
                var inquiries_block_note = fnApplyTmp(fnGetTmpExt('tmpString2'),{
                                                'var1':data.length,
                                                'var2':fnGetTotalAmt()
                                            });
            }


            /*update floating cart*/
            if ($(".expend_btn").hasClass("active")) {
                var expendIcon = '<span class="icon-chevron-down"></span>';
                var expendIconState = ' active';
            }else{
                var expendIcon = '<span class="icon-chevron-up"></span>';
                var expendIconState = '';
            } 
            var output = '<div class="control_wrap">'+
                            '<a class="checkout_btn" href="'+checkoutUrl+'"><span>'+
                                checkout_btn+
                            '</span></a>'+
                            '<div class="expend_btn'+expendIconState+'"><span>'+
                                expendIcon+
                            '</span></div>'+
                            '<div class="clear"></div>'+
                        '</div>'+
                        '<div class="list-wrapper">';

            /*update inquiries_block*/
            var inquiries_block_output = '';

            /*update enquiries msg*/
            var enquiries_message = "";

            /*responsive pannel*/
            var responsive_output = '<div class="control_wrap">'+
                                        '<a class="checkout_btn" href="'+checkoutUrl+'">'+
                                            checkout_btn_res+
                                        '</a>'+
                                        '<div class="clear"></div>'+
                                    '</div>'+
                                    '<div class="list-wrapper">';

            for (var i = 0; i < data.length; i++) {

                /* check mode for ui */ 
                if (mode == 'cart') {
                    //cart mode
                    var checkout_price_data = '<div class="item_price">'+fnGetTmpExt('price')+': '+fnPriceFormat(data[i]['price'],fnGetTmpExt('currency'))+' X '+data[i]['quantity']+' = ' + fnGetSum(data[i]['price'],data[i]['quantity']) + '</div>';
                    var checkout_list_data = fnGetTmpExt('quantity')+': <input class="pro-quantity-field" type="number" min="1" pro-no="'+data[i]['no']+'" value="'+data[i]['quantity']+'"> X '+fnPriceFormat(data[i]['price'],fnGetTmpExt('currency'))+ ' = ' + fnGetSum(data[i]['price'],data[i]['quantity']);
                    var checkout_list_data_res = '<div class="item_no">'+fnGetTmpExt('quantity')+': <input class="pro-quantity-field" type="number" min="1" pro-no="'+data[i]['no']+'" value="'+data[i]['quantity']+'"></div>';
                }else{
                    //default mode
                    var checkout_price_data = '';
                    var checkout_list_data = fnGetTmpExt('quantity')+': <input class="pro-quantity-field" type="number" min="1" pro-no="'+data[i]['no']+'" value="'+data[i]['quantity']+'">';
                    var checkout_list_data_res = '<div class="item_no">'+fnGetTmpExt('quantity')+': <input class="pro-quantity-field" type="number" min="1" pro-no="'+data[i]['no']+'" value="'+data[i]['quantity']+'"> X '+fnPriceFormat(data[i]['price'],fnGetTmpExt('currency'))+ ' = ' + fnGetSum(data[i]['price'],data[i]['quantity'])+'</div>';
                }

                /*update floating cart*/
                output += '<div class="item">'+
                              '<div class="item_no">'+fnGetTmpExt('quantity')+': <input class="pro-quantity-field" type="number" min="1" pro-no="'+data[i]['no']+'" value="'+data[i]['quantity']+'"></div>'+
                              '<div class="item_name">'+fnGetTmpExt('name')+': '+data[i]['name']+'</div>'+
                              checkout_price_data+
                              '<div class="move_btn" pro-no="'+data[i]['no']+'"><span class="i-center"><span class="icon-arrows"></span></span></div>'+
                              '<div class="delete_btn" pro-no="'+data[i]['no']+'"><span class="i-center"><span class="icon-trash"></span></span></div>'+
                           '</div>';

                /*update inquiries_block*/
                inquiries_block_output += '<div class="item">'+
                                            '<div class="control">'+
                                                '<div class="delete_btn" pro-no="'+data[i]['no']+'"><span class="i-center"><span class="icon-trash"></span></span></div>'+
                                                '<div class="move_btn" pro-no="'+data[i]['no']+'"><span class="i-center"><span class="icon-arrows"></span></span></div>'+
                                                '<div class="amt_field">'+checkout_list_data+'</div>'+
                                                '<div class="clear"></div>'+
                                            '</div>'+
                                            '<div class="item_num">'+data[i]['name']+'</div>'+
                                            '<div class="clear"></div>'+
                                        '</div>';

                /*update enquiries msg*/
                enquiries_message += fnApplyTmp(fnGetTmpExt('custom-submit-msg'), data[i]);


                /*responsive pannel*/
                responsive_output += '<div class="item">'+
                                            '<div class="delete_btn" pro-no="'+data[i]['no']+'"><span class="icon-trash"></span></div>'+
                                            '<div class="move_btn" pro-no="'+data[i]['no']+'"><span class="icon-arrows"></span></div>'+
                                            '<div class="item_num">'+data[i]['name']+
                                                '<span class="amt_field">'+
                                                    checkout_list_data+
                                                '</span>'+
                                            '</div>'+
                                            '<div class="clear"></div>'+
                                        '</div>';
            }

            /*update floating cart*/
            output += '</div><div class="clearAll_btn"><span><span class="icon-trash"></span> '+fnGetTmpExt('clearCartBtn')+'</span></div>';
            $("#cart").html(output);

            /*update inquiries_block*/
            if (data.length <= 0) {
                inquiries_block_output = fnGetTmpExt('no-item');
            }else{
                inquiries_block_output = '<div class="list-wrapper">'+inquiries_block_output+'</div>';
            }
            $("#inquiries_block").html(inquiries_block_output+'<div class="total_price">'+inquiries_block_note+'</div>');

            /*update enquiries msg*/
            if (data.length <= 0) {
                enquiries_message = fnGetTmpExt('no-item');
            }

            //use json data as enquiries message
            if (format == 'json') {
                enquiries_message = fnGetListStr();
            }
            $("input[name='enquiries']").val(enquiries_message);
            //console.log(enquiries_message);

            /*responsive pannel*/
            if (data.length <= 0) {
                responsive_output = fnGetTmpExt('no-item');
            }else{
                responsive_output += '</div>';
            }
            
            $("#resCart_btn_pannelContent .menuList").html(responsive_output);

            fnCheckInList();

            //debug mode show msg in console
            if (debug){
                var consoleMsg = 'Enquiries message: '+enquiries_message+'\n';
                console.log(consoleMsg);
            }

            fnUpdateSortUI();


            if (data.length > 0) {
                fnToggleCart($(".expend_btn"),'restart');
            }else{
                fnToggleCart($(".expend_btn"),'clear');
            }
            
        }

        //update jquery ui sortable
        function fnUpdateSortUI(){
            var current, update;
            $( ".list-wrapper" ).sortable({
                connectWith: ".item",
                handle: ".move_btn",
                placeholder: "portlet-placeholder ui-corner-all",
                axis: "y",
                start: function(e, ui) {
                    current = ui.item.index();
                },
                stop: function(e, ui) {
                    update = ui.item.index();
                    fnUpdateSort(current,update);
                }
            });
        }

        //update sortable data
        function fnUpdateSort(current,update){
            var currentList = fnGetData();
            var currentItem = currentList[current];
            var updateItem = currentList[update];

            currentList.splice(update, 1, currentItem);
            currentList.splice(current, 1, updateItem);

            switch(storageType) {
                case 'local':
                    localStorage.setItem(storageName, JSON.stringify(currentList));
                break;
                default:
                    sessionStorage.setItem(storageName, JSON.stringify(currentList));
                break;
            }

            fnUpdateCart(currentList);
        }

    }
}(jQuery, document, window));