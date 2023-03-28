class UIgoods {
    constructor(g) {
        this.data = g
        this.choose = 0
        // console.log(this.data);
    }
    // 当前的总价格
    getTotalPrice() {
        return this.choose*this.data.price
    }
    // 当前商品是否被选中
    isChoose() {
        return this.choose > 0
    }
    increase() {
     this.choose++
    }
    decrease() {
        if (this.choose === 0) {
            return
        }
       this.choose--
     }
}
// let uig = new UIgoods(goods[0])
// console.log(uig);

class UIData {
    constructor() {
        let uiGoods =[]
        for(let i=0 ; i< goods.length;i++) {
            let uig = new UIgoods(goods[i])
            uiGoods.push(uig)
        }
        this.uiGoods = uiGoods
        // console.log(this.uiGoods)
        this.deliveryThreshold = 30
        this.deliveryPrice = 5   
    }
    // 所有商品的总价
    getTotalPrice() {
        let sum = 0
        for(let i=0; i<this.uiGoods.length;i++) {
            sum += this.uiGoods[i].getTotalPrice()
        }
        return sum
    }
    //增加某一种商品的数量
    increase(index) {
        this.uiGoods[index].increase()
    }
     //减少某一种商品的数量
    decrease(index) {
        this.uiGoods[index].decrease()
    }

    //得到总共的选中数量
    getTotalChooseNumber() {
        let sum = 0;
        for(let i=0; i<this.uiGoods.length;i++) {
            sum += this.uiGoods[i].choose
        }
        return sum
    }
    // 购物车中是否有东西
    hasGoodsIncar() {
        return this.getTotalChooseNumber > 0
    }
    //判断有没有达到配送的门槛
    iscrossDeliveryThreshold() {
        return this.getTotalPrice() >= this.deliveryThreshold
    }
    isChoose(index) {
        return this.uiGoods[index].isChoose()
    }
}
// let ui = new UIData(UIgoods)
// 整个界面
class UI {
    constructor() {
        this.uiData = new UIData()
        console.log(this.uiData);
        this.doms = {
            goodsContainer: document.querySelector('.goods-list'),
            deliveryPrice:document.querySelector('.footer-car-tip'),
            footerPay:document.querySelector('.footer-pay'),
            footerpayInnerSpan:document.querySelector('.footer-pay span'),
            footerTotalPrice:document.querySelector('.footer-car-praic'),
            footerCar:document.querySelector('.footer-car'),
            footerCarNum:document.querySelector('.footer-car-num')
         }
        let carRect = this.doms.footerCar.getBoundingClientRect()
        let jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5 
        }
        this.jumpTarget = jumpTarget
        this.createHTML()
        this.updataFooter()
        this.listenEvent()
    }

    // 监听事件
    listenEvent() {
        this.doms.footerCar.addEventListener('animationend', function() {
            this.classList.remove('animate')
        })
    }


    //根据商品数据创建商品
    createHTML() {
        //1.生成html字符串（开发效率高，执行效率低）
        let html = '';
        for(let i =0; i<this.uiData.uiGoods.length;i++) {
            let g = this.uiData.uiGoods[i]
            // console.log(g);
            html += `
            <div class="goods-item">
            <img src="" alt="">
            <div class="goods-info">
                <h2 class="goods-title">${g.data.title}</h2>
                <p class="goods-desc">${g.data.desc}</p>
                <p class="goods-sell">
                    <span>月售 ${g.data.sellNumber}</span>
                    <span> 好评 ${g.data.favorRate}</span>
                </p>
                <div class="goods-confirm">
                    <p class="goods-price">
                        <span class="goods-price-unit">￥</span>
                        <span>${g.data.price}</span>
                    </p>
                    <div class="goods-btns">
                        <i data-id="${i}" class="iconfont icon-jianhao"></i>
                        <span>${g.choose}</span>
                        <i data-id="${i}" class="iconfont icon-jiahao1"></i>
                    </div>
                </div>
            </div>
        </div>
            `
        }
        // console.log(html);
        //2.一个一个创建元素（开发效率低，执行效率高）
        this.doms.goodsContainer.innerHTML = html
    }

     // 商品增加效果集
    increase(index) {
        this.uiData.increase(index)
        this.updataGoodsItem(index)
        this.updataFooter()
        this.jump(index)
    }
    // 商品减少效果集
    decrease(index) {
        this.uiData.decrease(index)
        this.updataGoodsItem(index)
        this.updataFooter()  
    }

    // 更新某个商品的状态
    updataGoodsItem(index) {
        let goodsDom =  this.doms.goodsContainer.children[index]
        if(this.uiData.isChoose(index)) {
            goodsDom.classList.add('active')
        } else {
            goodsDom.classList.remove('active')
        }
        let span  =  goodsDom.querySelector('.goods-btns span')
        span.innerHTML = this.uiData.uiGoods[index].choose
    }

    //更新页脚
    updataFooter() {
        let total = this.uiData.getTotalPrice()
        this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`
        if(this.uiData.iscrossDeliveryThreshold()) {
            //可以起送
            this.doms.footerPay.classList.add('show')
        } else {
            this.doms.footerPay.classList.remove('show')
            // 更新后还差多少钱
            let dis = this.uiData.deliveryThreshold - total
            // console.log(dis);
            dis = Math.round(dis)
            this.doms.footerpayInnerSpan.textContent = `还差￥${dis}元起送 `
        }
        this.doms.footerTotalPrice.textContent = `￥${total.toFixed(2)}`
        if(this.uiData.getTotalChooseNumber()>0) {
            this.doms.footerCar.classList.add('active')
            this.doms.footerCarNum.textContent = this.uiData.getTotalChooseNumber()
        } else {
            this.doms.footerCar.classList.remove('active')
        }
    }

    // 购物车动画
    carAnimate() {
        this.doms.footerCar.classList.add('animate')

        // 监听只用做一次就好了
        // this.doms.footerCar.addEventListener('animationend', function() {
        //     this.classList.remove('animate')
        // })
    }

    //抛物线元素
    jump(index) {
        let addBtn = this.doms.goodsContainer.children[index].querySelector('.icon-jiahao1')
        let rect = addBtn.getBoundingClientRect()
        let start = {
            x: rect.left,
            y: rect.top
        }
        // 跳跃动画
        let div = document.createElement('div')
        div.classList.add('add-to-car')
        let i = document.createElement('i')
        // i.classList.add('iconfont icon-jiahao1')
        i.className = 'iconfont icon-jiahao1'

        div.style.transform = `translateX(${start.x}px)`
        i.style.transform = `translateY(${start.y}px)`
        div.appendChild(i)
        document.body.appendChild(div)
        
        // 强行渲染  重排
        div.clientWidth 
        
        //设置结束位置
        div.style.transform = `translateX(${this.jumpTarget.x}px)`
        i.style.transform = `translateY(${this.jumpTarget.y}px)`

        //过渡结束
        let that = this
        div.addEventListener('transitionend' , function() {
            div.remove()
            that.carAnimate()
        }),
        {
            once: true, // 事件触发一次
        }
    }

}

let ui = new UI();

ui.doms.goodsContainer.addEventListener('click' , function(e) {
    let index = +e.target.dataset.id
    // console.log(e);
    // 判断这个对象的内样式里面有没有包含这个内样式
    if(e.target.classList.contains('icon-jiahao1')) {
        
        // console.log(index);
        ui.increase(index)
    } else if( e.target.classList.contains('icon-jianhao')) {
        // let index = +e.target.getAttribute('index')
        ui.decrease(index)
    }
})
window.addEventListener('keydown',function(e){
    // console.log(e.code);
    if(e.code === 'ArrowLeft') {
        ui.increase(0)
    } else if (e.code === 'ArrowRight') {
        ui.decrease(0)
    }
})
