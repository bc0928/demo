;
+function ($) {
    $.Banner = function (options) {
        // options传入的参数：运动方式（slide|fade），小翅膀选择器，是否自动轮播
        new Banner( options, this);
    }

    function Banner( options, baseEle) {
        this.init( options, baseEle);
    }
    Banner.prototype = {
        constructor: Banner,
        init(options, baseEle){
            //当前显示的内容;
            this.index = 0;
            // 轮播图主体元素选择;
            this.bannerWrapper = $(".banner-wrapper");
            //动画模式;  如果没有传入动画方式，默认为fade
            this.animate = options.animate ? options.animate : "fade";
            //每个图片———具体元素获取;
            this.bannerItem = this.bannerWrapper.children();

            // 有选择自动播放则执行  没有不执行自动播放
            if (options.autoPlay) {
                this.autoPlay();
            }
            // 整个banner的长度
            this.bannerNum = this.bannerItem.length; 

            //小翅膀按钮获取;
            if ( !options.nextBtn || !options.prevBtn) return;      //参数判断
            this.btnPrev = options.prevBtn;
            this.btnNext = options.nextBtn;
            
            // on的中间参数，添加一个对象默认为对象中的data属性
            this.btnPrev
                .on("click.changeIndex", { direc: "prev" }, $.proxy(this.change_index, this))
                .on("click.animation", $.proxy(this.animation, this))
            this.btnNext
                .on("click.changeIndex", { direc: "next" }, $.proxy(this.change_index, this))
                .on("click.animation", $.proxy(this.animation, this))
        },


        change_index: function (event) {
            //改变 index;
            // console.log(event.data);
            // console.log(this);
            var turnList = {
                // 上一张  左边小翅膀
                "prev": function () {
                    this.prev = this.index;
                    if (this.index == 0) {
                        this.index = this.bannerNum - 1;
                    } else {
                        this.index--;
                    }
                }.bind(this),
                // 下一张 右边小翅膀
                "next": function () {
                    this.prev = this.index;
                    if (this.index == this.bannerNum - 1) {
                        this.index = 0;
                    } else {
                        this.index++;
                    }
                }.bind(this)

            }
            // on中间参数 data 
            if (!(typeof turnList[event.data.direc] == "function")) return 0;
            // 根据相应的event.data.direc：   prev || next 执行相应的逻辑
            turnList[event.data.direc]();
            // console.log(this.index);
        },


        animation: function (event) {
            // console.log(event.data.ani)
            if (this.prev == this.index) return;

            var animationList = {
                // 下拉效果 active的样式： z-index：2    没有active的为1
                "slide": function () {
                    animationList.slideFadeInit();
                    this.bannerItem.eq(this.index)
                        .addClass("active")
                        .css({
                            display: "none"
                        })
                        .slideDown()
                        .siblings()
                        .removeClass("active");
                }.bind(this),
                // 淡入淡出效果  active的样式： z-index：2    没有active的为1
                "fade": function () {
                    animationList.slideFadeInit();
                    this.bannerItem.eq(this.index)
                        .addClass("active")
                        .css({
                            display: "none"
                        })
                        .fadeIn()
                        .siblings()
                        .removeClass("active");
                }.bind(this),
                "slideFadeInit": function () {
                    this.bannerItem.eq(this.prev)
                        .css({
                            zIndex: 1
                        })
                        .siblings()
                        .css({
                            zIndex: ""
                        })
                }.bind(this)
            }
            animationList[this.animate]();
            
        },
        // 自动轮播
        autoPlay(){
            this.bannerWrapper.on("mouseenter", function () {
                // 鼠标移动到banner区域，清除定制器，不让其自动轮播
                clearInterval(this.loopTimer);
            }.bind(this))
            this.bannerWrapper.on("mouseleave", function () {
                // 鼠标离开banner区域，自动轮播开始
                clearInterval(this.loopTimer);
                this.loopTimer = setInterval(function () {//自动轮播
                    this.prev = this.index;
                    this.index = ++this.index % this.bannerNum;
                    this.animation();
                }.bind(this), 2000);
            }.bind(this))
            this.bannerWrapper.trigger("mouseleave");
        } 
    }
}(jQuery);


