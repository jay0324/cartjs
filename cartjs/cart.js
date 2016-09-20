//simple cart.js
//coder: jh
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
            data: "data.json",
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
                "submitBtn": "訂購",
                "deleteBtn": '<i class="fa fa-trash" aria-hidden="true"></i> 刪除',
                "no-item": "目前尚無任何項目!",
                "tmpString1": '詢問 {var1} 項商品, 共 {var2} 件 / 總金額 {var3}',
                "tmpString2": '詢問 {var1} 項商品, 共 {var2} 件',
                "tmpString3": '<i class="fa fa-envelope" aria-hidden="true"></i> 送出詢問函</span>',
                "tmpString4": '<i class="fa fa-shopping-cart" aria-hidden="true"></i> 結帳 (總計 {var1})',
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
            fnToggleCart($(this));
            return false;
        })

        /*init cart*/
        function fnInitCart(){
            $("body").append('<div id="cart">');
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
        function fnToggleCart(target){
            if ($(target).hasClass("active")) {
                $("#cart").animate({'height':'42px','width':'250px'},200);
                $(target).html('<span><i class="fa fa-chevron-up" aria-hidden="true"></i></span>').removeClass("active");
            }else{
                $("#cart").animate({'height':'99%','width':'400px'},200);
                $(target).html('<span><i class="fa fa-chevron-down" aria-hidden="true"></i></span>').addClass("active");
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
                var expendIcon = '<i class="fa fa-chevron-down" aria-hidden="true"></i>';
                var expendIconState = ' active';
            }else{
                var expendIcon = '<i class="fa fa-chevron-up" aria-hidden="true"></i>';
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
                              '<div class="item_name">'+fnGetTmpExt('name')+': '+data[i]['name']+'</div>'+
                              '<div class="item_no">'+fnGetTmpExt('quantity')+': <input class="pro-quantity-field" type="number" min="1" pro-no="'+data[i]['no']+'" value="'+data[i]['quantity']+'"></div>'+
                              checkout_price_data+
                              '<div class="delete_btn" pro-no="'+data[i]['no']+'"><i class="fa fa-trash" aria-hidden="true"></i></div>'+
                        '</div>';

                /*update inquiries_block*/
                inquiries_block_output += '<div class="item">'+
                                            '<div class="delete_btn" pro-no="'+data[i]['no']+'"><i class="fa fa-trash" aria-hidden="true"></i></div>'+
                                            '<div class="item_num">'+data[i]['name']+
                                                '<span class="amt_field">'+
                                                    checkout_list_data+
                                                '</span>'+
                                            '</div>'+
                                            '<div class="clear"></div>'+
                                        '</div>';

                /*update enquiries msg*/
                enquiries_message += fnApplyTmp(fnGetTmpExt('custom-submit-msg'), data[i]);


                /*responsive pannel*/
                responsive_output += '<div class="item">'+
                                            '<div class="item_name">'+fnGetTmpExt('name')+': '+data[i]['name']+'</div>'+
                                            checkout_list_data_res+
                                            '<div class="delete_btn" pro-no="'+data[i]['no']+'">X</div>'+
                                      '</div>';
            }

            /*update floating cart*/
            output += '</div>';
            $("#cart").html(output);

            if (data.length > 0) {
                $("#cart").slideDown(200);
            }else{
                $("#cart").slideUp(200);
            }

            /*update inquiries_block*/
            if (data.length <= 0) {
                inquiries_block_output = fnGetTmpExt('no-item');
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
            
            $("#enquiry_btn_pannelContent .menuList").html(responsive_output);

            fnCheckInList();

            //debug mode show msg in console
            if (debug){
                var consoleMsg = 'Enquiries message: '+enquiries_message+'\n';
                console.log(consoleMsg);
            }
        }

    }
}(jQuery, document, window));