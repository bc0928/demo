define(['jquery'], function() {
    function renderPage(url,selector){
        // 参数判断，如果没传url或者选择器，则不执行
        if (!url || !selector) return;
        this.url = url;                         //接口
        this.main = $(selector);                //渲染模板的容器
        this.init();
   }
    renderPage.prototype = {
        constructor: renderPage,
        init(){
            // console.log(1);
            this.load_data()
            .then(function(res){
                // ajax请求成功
                this.json = res.data.list;
                console.log(this.json);
                this.render_data(); //根据数据渲染到页面
            }.bind(this))
            .fail(function (def, type, err_msg) {
                // ajax请求失败
            })
        },
        load_data(){
            // ajax请求数据
            this.opt = {
                url:this.url,
                dataType: "jsonp",
                statusCode: {
                    404: function () {
                        alert('page not found');
                    },
                    403: function () {
                        alert('丫不让我访问!');
                    }
                }
            }
            return $.ajax(this.opt);
        },
        render_data(){
            console.log(2)
            // 根据请求的数据渲染页面
            this.html = "";
            this.json.forEach(function(item){
                this.html += ` <li>
                                    <a href="###">
                                        <img src="${item.image}">
                                    </a>
                                    <div class="info">
                                        <div class="part">
                                            <div class="price">￥${item.price}</div>
                                            <div class="collect">
                                                <i class="icon-star"></i>195
                                            </div>
                                        </div>
                                        <a class="title" href="http://item.meilishuo.com/detail/1kkehqm">
                                            <i class="icon-select"></i> ${item.title}
                                        </a>
                                        <button class="btn" goodsId="${item.item_id}">立即购买</button>
                                    </div>
                                </li>`
            }.bind(this));
            this.main.html(this.html);
        }
    }
    return renderPage;
});