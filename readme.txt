CARTJS
簡單購物車

使用方式

#項目按鈕======================
<!-- list inquiry btn -->
<div class="list_inquiry_box">
    <label>數量:</label>
    <input type="number" class="pro-quantity-field" pro-no="項目編號" value="1" min="1" />
    <a href="#" class="inquiry_btn" pro-no="項目編號" pro-name="項目名稱" pro-price="價格"></a>
    <div class="clear"></div>
</div>

#表單區列表===================
<!-- Send the fields that program need -->
<div class="inquiries_container">
    <label for="inquiries_block">
    	<i class="fa fa-shopping-cart" aria-hidden="true"></i> 訂購清單
    </label>
    <div id="inquiries_block" class="list-wrapper"></div>
    <input type="hidden" name="enquiries" value="" />
</div>

#引用程式=====================
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

#設定值===========================
$.simplecart({
	mode: (String)(模式: 購物: cart (預設), 詢價: inq),
    debug: (Boolean)(Console出form的值:不顯示: false (預設), 顯示: true),
    storageType: (String)(存取資料的方式: 暫存: session(預設), 永久: local),
    storageName: (String)(存取資料集名稱: simplestorage (預設)),
    checkoutUrl: (String)(表單連結: checkout.html(預設)),
    format: (String)(表單欄位值: json: json格式(預設), str: 自訂字串),
    tmp: {
    	(obj)(內建UI顯示文字及範本,預設值如下)

        "quantity": '數量',
        "currency": '$',
        "price": '價格',
        "no": '編號',
        "name": '品名',
        "clearCartBtn": '全部清空',
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
    }
})


#備註==============================
dist資料夾中的檔案已把外掛都打包起來了，可以直接用即可
