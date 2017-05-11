CARTJS Simple JQuery Cart
=========================

#Item Inquiry/Order button
-------------
```
<!-- list inquiry btn -->
<div class="list_inquiry_box">
    <label>Qty:</label>
    <input type="number" class="pro-quantity-field" pro-no="{item No}" value="1" min="1" />
    <a href="#" class="inquiry_btn" pro-no="{item No}" pro-name="{item Name}" pro-price="{item Price}"></a>
    <div class="clear"></div>
</div>
```


#Form input field
-------------
```
<!-- Send the fields that program need -->
<div class="inquiries_container">
    <label for="inquiries_block">
    	<i class="fa fa-shopping-cart" aria-hidden="true"></i> Check Out List
    </label>
    <div id="inquiries_block" class="list-wrapper"></div>
    <input id="enquiries_data" type="hidden" name="enquiries" value="" />
</div>
```


#Jquery cartjs plugin
-------------
```
<!-- jquery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	
<!-- carjs -->
<link href="{path_to_cartjs}/cartjs.min.css" rel="stylesheet" type="text/css" />
<script id="cartscript" src="{path_to_cartjs}/cartjs.min.js"></script>

<script>
	$(function(){
		$.simplecart();
	})
</script>
```

#Custom Setup
-------------
```
$.simplecart({
	mode: (String)(Mode: Shopping Cart: cart (default), Inquiries: inq),
    debug: (Boolean)(Console form value:Hide: false (default), Show: true),
    storageType: (String)(Storage: tmp per windows: session(default), tmp for browser: local),
    storageName: (String)(storage name: simplestorage (default)),
    checkoutUrl: (String)(check out form url: checkout.html(default)),
    format: (String)(submit data: json: json(default), str: custom data defined by tmp->custom-submit-msg),
    tmp: {
    	(obj)(UI text and template)

        "quantity": 'Qty.',
        "currency": '$',
        "price": 'Price',
        "no": 'No',
        "name": 'Name',
        "clearCartBtn": 'Remove All',
        "submitBtn": "Check out",
        "deleteBtn": '<span class="icon-trash"></span> Remove',
        "no-item": "Nothing in Cart!",
        "tmpString1": 'Order {var1} products, total {var2} items / subtotal {var3}',
        "tmpString2": 'Inquire {var1} products, total {var2} items',
        "tmpString3": '<span class="icon-envelope"></span> Inquiries</span>',
        "tmpString4": '<span class="icon-shopping-cart"></span> Subtotal (total {var1})',
        "tmpString5": '{var1} Checkout',
        "tmpString6": 'Send Inquiries',
        "custom-submit-msg": 'Product: {name} / Qty: {quantity} / Price: {price||format_price} \n'
    }

})
```

#Note
-------------
"dist" folder contains require files，just copy this folder to your site root, and do the setup as above


#chinese version tmp:
-------------
```
tmp: {
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
}
```

#Clear storage
-------------
for web form submition, after submit the data to server side, you need to manually clear the storage.
The easy way to do it is to create a page with the code to trigger the [clearAll_btn] button event
```
//clear storage only
$(".clearAll_btn").click();

//optional to clear storage and then return to anypage you want
//it has a count down message to indicate sec to return
//put this to html:
//<center>Thanks for your Inquiry, we will redirect for you in <span id="count">5</span>sec!</center>
$(".clearAll_btn").click();var i = 5;setInterval(function(){$("#count").text(i);i--;},1000);setTimeout(function(){window.location = 'RETURN_PAGE_URL';},5000);
```
