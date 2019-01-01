// 思路    init函数 ==》 生成图片函数 绑定游戏状态函数 底层是数组的来操控


var imgArea = $('.imgArea');
var imgCell;
var len;
var imgW = $('.imgArea').width();
var imgH = $('.imgArea').height();
var cellW = Math.floor(imgW / 4);
var cellH = Math.floor(imgH / 4);
var flag = true;
var ranArr;
var oriArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];


// 初始化函数
function init() {
    imgSplit();
    gameState();
}
init();


// 生成图片函数
function imgSplit() {
    
    var str = '';
    for(var row = 0; row < 4; row ++) {
        for(var col = 0; col < 4; col ++) {
            str += '<div class="imgCell"></div>';
        }
    }
    imgArea.append(str);
    imgCell = $('.imgCell');
    len = imgCell.length;

    for(var i = 0; i < len; i++) {
        var row = Math.floor(i / 4);
        var col = i % 4;
        $(imgCell).eq(i).css({
            'width': cellW + 'px',
            'height': cellH + 'px',
            'left': col * cellW + 'px',
            'top': row * cellH + 'px',
            'backgroundPosition': (-col) * cellW + 'px ' + (-row) * cellH + 'px'
        })
    }

}


// 绑定状态
function gameState() {

    $('.button').click(function() {

        if(flag) { // 加个锁
            flag = false;
            $(this).text('复原');

            // 1. 生成乱序数组
            // 2. 把乱序数组展示出来 图片排序
            randomArr();
            cellOrder(ranArr);

            // 绑定事件
            imgCell.on('mousedown', function(e) {

                // 求鼠标方块的索引值
                var index1 = $(this).index();  
                
                // 鼠标到选中方块边框的距离
                var cellLeft = e.pageX - $(imgCell).eq(index1).offset().left,
                    cellTop = e.pageY - $(imgCell).eq(index1).offset().top;


                $(document).on('mousemove', function(e2) {

                    var left = e2.pageX - $(imgArea).offset().left - cellLeft,
                        top = e2.pageY - $(imgArea).offset().top - cellTop;
                    $(imgCell).eq(index1).css({
                        'left': left + 'px',
                        'top': top + 'px',
                        'z-index': 40
                    })

                }).on('mouseup', function(e3) {

                    var left = e3.pageX - $(imgArea).offset().left,
                        top = e3.pageY - $(imgArea).offset().top;

                    var index2 = changIndex(left, top, index1); 

                    if(index1 === index2) {

                       cellReturn(index1);

                    }else {

                        // 交换数组位置以及图片位置交换 
                        cellChange(index1, index2);

                    }
                    
                    // 解除绑定
                    $(document).off('mousemove').off('mouseup');
            
                })

            })
         
        }else {

            flag = true;
            $(this).text('开始')
            
            // 把正序数组传入cellOrder排序
            cellOrder(oriArr);
            $(imgCell).off('mousedown').off('mousemove').off('mouseup');

        }

    })

}


// 生成乱序数组
function randomArr() {

    ranArr = [];
    // 随机生成16位不重复的数组
    for(var i = 0; i < len; i++) {
        var num = Math.floor(Math.random() * len);  // 生成范围[0 - 15]  
        while($.inArray(num, ranArr) > -1) { // 如果生成的数字重复再继续生成随机数字
            num = Math.floor(Math.random() * len);
        }  
        ranArr.push(num);
    }

}


// 传入数组 图片排序展示
function cellOrder(arr) {
    
    var row,
        col;
    for(var i = 0; i < len; i++) {
        row = Math.floor(arr[i] / 4);
        col = arr[i] % 4;
        $(imgCell).eq(i).animate({
            'left': col * cellW + 'px',
            'top': row * cellH + 'px'
        }, 400)
    }

    imgCell = $('.imgCell');
}


// 找索引 $.inArray(i, arr);
// 原来的数组      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]   img
// 改变的数组      [1, 8, 14, 9, 10, 15, 5, 11, 2, 0, 7, 3, 4, 12, 13, 6]   找哪个找索引



// 判断方块的位置 返回索引值
function changIndex(left, top, i) {

    if(left < 0 || top < 0 || left > imgW || top > imgH) { // 如果超出范围则返回原位置
        return i;
    }else {
        var row = Math.floor(top / cellH),
            col = Math.floor(left / cellW);

        var num = col + row * 4;
        return $.inArray(num, ranArr);
    }
    
}


// 图片回到原来的位置
function cellReturn(index) {
    var num = ranArr[index],
        row = Math.floor(num / 4),
        col = num % 4;

    $(imgCell).eq(index).animate({
        'left': col * cellW + 'px',
        'top': row * cellH + 'px',
    }, 400, function() {
        $(this).css('z-index', 10);
    });
}


// 交换数组位置 
function cellChange(from, to) {

    // 图片位置交换
    var fromRow = Math.floor(ranArr[from] / 4),  // 行
        fromCol = ranArr[from] % 4,   // 列
        toRow = Math.floor(ranArr[to] / 4),
        toCol = ranArr[to] % 4;

    // 图片位置交换
    $(imgCell).eq(from).animate({
        'left': toCol * cellW + 'px',
        'top': toRow * cellH + 'px',
    }, 400, function() {
        $(this).css('z-index', 10); 
    })
    $(imgCell).eq(to).animate({
        'left': fromCol * cellW + 'px',
        'top': fromRow * cellH + 'px',
    }, 400, function() {
        $(this).css('z-index', 10);

         // 交换数组的位置
        var temp = ranArr[from];
            ranArr[from] = ranArr[to];
            ranArr[to] = temp;
        
        // 每次交换之后都检查是否成功
        check();

    })

}


// 检查是否成功
function check() {
    var oriStr = oriArr.toString();
    var ranStr = ranArr.toString();
    if(oriStr === ranStr) {
        alert('恭喜成功了');  
        $('.button').text('开始');
        flag = true;  
    }
}


// 感悟: 写代码前 必须花一定的事件架构整体的思路 理清思路再写代码
