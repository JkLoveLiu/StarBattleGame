$(function() {


    var getScore = 0; // 获得的分数
    var allTime = 0; // 经过的时间
    var jdtWidth = 75; // 进度条
    var jdtTime = 15; // 进度条内容
    var finallyCountInformation = []; // 游戏结束统计信息
    // 定义计时器的ID
    var setIntervalId1, // 自动创建敌机
        setIntervalId2, // 自动创建行星
        setIntervalId3, // 自动创建油桶
        setIntervalId4, // 自动创建不可碰撞行星
        setIntervalId5, // 刷新监听器
        setIntervalId6, // 游戏时间
        setIntervalId7, // 进度条
        setIntervalId8; // 自己的飞碟旋转
    // 开始游戏按钮单击
    $('.btn_startGame').click(function() {
        // 移除遮罩层
        $('.zhezhao').remove();
        // 飞机进入
        $('.hero_ship').show().css({
            top: 130,
        }).animate({
            left: 10
        }, 1000);
        // 开始监听
        monitor();
        // 加载完成后立即出现一个飞碟
        add_enemy_ship();
        // 加载完成后立刻生成行星
        add_planet();
        // 每隔几秒创建一个飞碟
        setIntervalId1 = setInterval(add_enemy_ship, 1900);
        // 每隔几秒生成一个行星
        setIntervalId2 = setInterval(add_planet, 3200);
        // 生成油桶
        setIntervalId3 = setInterval(add_energy, 3146);
        // 生成不可碰撞行星
        setIntervalId4 = setInterval(add_planet_nobump, 1846);
        // 控制英雄飞碟旋转
        hero_ship_revolve();
        // 播放背景音乐
        musicPlay();
        // 开始计时
        runTime();
        // 进度条控制
        progressControl();
        // 游戏状态   运行
        gameRuning = true;
    });

    // 判断音乐状态
    function musicPlay() {
        $('audio').get(0).play();
        $('audio').get(0).paused = false;
    }

    // 静音按钮
    $('.control_sound').click(function() {
        for (var i = 0; i < $('audio').length; i++) {
            if ($('audio').get(i).muted) {
                $('audio').get(i).muted = false;
                $('audio').get(0).paused = false;
                $('.control_sound').attr('src', './img/speaker.png')
            } else {
                $('audio').get(i).muted = true;
                $('audio').get(0).paused = true;
                $('.control_sound').attr('src', './img/mute.png')
            }
        }
    });
    // 音量加
    $('.addSound').click(function() {
        for (var i = 0; i < $('audio').length; i++) {
            var musicVolume = $('audio').get(i).volume;
            if (musicVolume == 1) { return 1; }
            musicVolume += 0.1;
            $('audio').get(i).volume = musicVolume;
        }
    });
    // 音量减
    $('.lessSound').click(function() {
        for (var i = 0; i < $('audio').length; i++) {
            var musicVolume = $('audio').get(i).volume;
            if (musicVolume == 0) { return 0; }
            musicVolume -= 0.1;
            $('audio').get(i).volume = musicVolume;
        }
    });
    // 暂停游戏
    $('.game_pause').click(function() {
        keyPdown();
		
    });
    // 游戏结束后，出现的按钮点击事件
    $('.submitInformation').click(function() {
        // 提交信息
        if ($('.informationText').val().length == 0 || $('.informationText').val().length > 5) {
            alert('请输入长度大于0小于4的名字');
        } else {
            // 动画
            $(this).parent().parent().fadeOut(500, function() {
                // 隐藏当前窗口
                $(this).hide();
                // 显示下一窗口
                $('.finallyScore').show();
            });
            // 向数组添加元素
            finallyCountInformation.push({
                name: $('.informationText').val(),
                score: getScore,
                time: allTime,
            });
            // 排序数组
            finallyCountInformation.sort(compare('score', 'time'));
            // 移除当前的元素
            $('.rankDivContent').remove();
            // 循环插入元素
            for (var i = 0; i < finallyCountInformation.length; i++) {
                var strc = '<ul class="rankDivContent">' +
                    '<li>' + (i + 1) + '</li>' +
                    '<li>' + finallyCountInformation[i].name + '</li>' +
                    '<li>' + finallyCountInformation[i].score + '</li>' +
                    '<li>' + finallyCountInformation[i].time + '</li>' +
                    '</ul>'
                $('.rankDiv').append(strc);

            }
        }

    });
    // 重新开始游戏
    $('.return_startGame').click(function() {
        // 初始化内容 
        getScore = 0; // 获得的分数
        allTime = 0; // 经过的时间
        jdtWidth = 75; // 进度条
        jdtTime = 15; // 进度条内容
        // 清除飞碟的旋转
        clearInterval(setIntervalId8);
        // 飞机进入
        $('.hero_ship').show().css({
            top: 130,
        }).animate({
            left: 10
        }, 1000);
        // 开始监听
        monitor();
        // 加载完成后立即出现一个飞碟
        add_enemy_ship();
        // 加载完成后立刻生成行星
        add_planet();
        // 每隔几秒创建一个飞碟
        setIntervalId1 = setInterval(add_enemy_ship, 1900);
        // 每隔几秒生成一个行星
        setIntervalId2 = setInterval(add_planet, 3200);
        // 生成油桶
        setIntervalId3 = setInterval(add_energy, 3146);
        // 生成不可碰撞行星
        setIntervalId4 = setInterval(add_planet_nobump, 1846);
        // 控制英雄飞碟旋转
        hero_ship_revolve();
        // 播放背景音乐
        musicPlay();
        // 开始计时
        runTime();
        // 进度条控制
        progressControl();
        // 游戏状态   运行
        gameRuning = true;
        // 隐藏页面
        $('.finallyScore').fadeOut(500, function() {
            $('.finallyScore').hide();
        });
    });

    // 监听按键是否按下
    $(document).keydown(function(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
            // 上
            keyDownArr[0] = true;
        } else if (e.keyCode == 39 || e.keyCode == 68) {
            // 右
            keyDownArr[1] = true;
        } else if (e.keyCode == 83 || e.keyCode == 40) {
            // 下
            keyDownArr[2] = true;
        } else if (e.keyCode == 65 || e.keyCode == 37) {
            // 左
            keyDownArr[3] = true;
        }

    });
    // 监听按键是否抬起
    $(document).keyup(function(e) {
        if (e.keyCode == 87 || e.keyCode == 38) {
            // 上
            keyDownArr[0] = false;
        } else if (e.keyCode == 39 || e.keyCode == 68) {
            // 右
            keyDownArr[1] = false;
        } else if (e.keyCode == 83 || e.keyCode == 40) {
            // 下
            keyDownArr[2] = false;
        } else if (e.keyCode == 65 || e.keyCode == 37) {
            // 左
            keyDownArr[3] = false;
        } else if (e.keyCode == 32) {
            if (gameRuning) {
                add_bullet();
                $('audio').get(2).play();
            }
        } else if (e.keyCode == 80) {
            // 游戏暂停
            keyPdown();
        }

    });
    // 记录按键是否按下  默认否
    //                 上    右    下    左
    var keyDownArr = [false, false, false, false];

    // 判断游戏状态 true=运行
    var gameRuning = false;
    // 暂停游戏的函数
    function keyPdown() {
        if (gameRuning) {
            gameRuning = false;
            clearInterval(setIntervalId1);
            clearInterval(setIntervalId2);
            clearInterval(setIntervalId3);
            clearInterval(setIntervalId4);
            clearInterval(setIntervalId5);
            clearInterval(setIntervalId6);
            clearInterval(setIntervalId7);
            // 暂停动画
            // 子弹动画
            $('.bullet').stop(true);
            // 敌方飞船动画
            $('.enemy_ship').stop(true);
            // 不可碰撞行星动画
            $('.planet_nobumpAll').stop(true);
            // 可碰撞行星动画
            $('.planet_all').stop(true);
            // 油桶动画停止
            $('.energy').stop(true);
			//按钮变为暂停
			$(".game_pause").attr('src', './img/play.png');
        } else {
            gameRuning = true;
            // 动画继续
            playAnimate();
            // 开始计时
            runTime();
            // 进度条控制
            progressControl();
            // 开始监听
            monitor();
            // 每隔几秒创建一个飞碟
            setIntervalId1 = setInterval(add_enemy_ship, 1900);
            // 每隔几秒生成一个行星
            setIntervalId2 = setInterval(add_planet, 3200);
            // 生成油桶
            setIntervalId3 = setInterval(add_energy, 3146);
            // 生成不可碰撞行星
            setIntervalId4 = setInterval(add_planet_nobump, 1846);
			//按钮变为继续游戏
			$(".game_pause").attr('src', './img/pause.png');
        }
    }

    // 游戏进行时间
    function runTime() {
        setIntervalId6 = setInterval(() => {
            allTime += 1;
            $('.count_time>p').text(allTime);
        }, 1000);
    }
    // 进度条控制
    function progressControl() {
        setIntervalId7 = setInterval(() => {
            jdtTime -= 1;
            jdtWidth -= 5;
            gameOver();
        }, 1000);
    }

    // 控制飞船移动
    function moveHero_Ship() {
        var heroPosition = $('.hero_ship').position();
        var heroTop = heroPosition.top;
        var heroLeft = heroPosition.left;
        // 飞碟运动        
        if (keyDownArr[0]) { // 上
            heroTop -= 5;
        } else if (keyDownArr[1]) { // 右
            heroLeft += 5;
        } else if (keyDownArr[2]) { // 下
            heroTop += 5;
        } else if (keyDownArr[3]) { // 左
            heroLeft -= 5;
        }
        // 控制上下边界
        if (heroTop <= -10) {
            heroTop = -10;
        } else if (heroTop >= 320) {
            heroTop = 320;
        }
        // 控制左右边界
        if (heroLeft <= 0) {
            heroLeft = 0;
        } else if (heroLeft >= 680) {
            heroLeft = 680;
        }
        $('.hero_ship').css({
            left: heroLeft,
            top: heroTop
        })
    }

    // 生成子弹,发射子弹
    function add_bullet() {
        var position = $('.hero_ship').position();
        var top = position.top;
        var left = position.left;

        var str = '<div class=\"bullet\" ' +
            'style=\"left:' + (left + 60) +
            'px;top:' + (top + 30) + 'px\" ' +
            '></div>';

        $('.game').append(str);

        // 子弹向右运动
        $('.bullet').animate({
            left: 760
        }, 2500, 'linear', function() {
            remove_bullet();
        });

    }

    // 移除子弹
    function remove_bullet() {
        for (var i = 0; i < $('.bullet').length; i++) {
            var position = $('.bullet').eq(i).position();
            var left = position.left;
            if (left > 730) {
                $('.bullet').eq(i).remove();
            }
        }
    }

    // 飞碟自转
    // 自己的飞碟旋转
    function hero_ship_revolve() {
        var i = 0;

        function hero_revolve() {
            $('.hero_ship').css('background-position', '-' + i + 'px 0px');
            i += 70;
            if (i > 140) i = 0;
        };
        setIntervalId8 = setInterval(hero_revolve, 100);
    }

    var tid;
    // 敌方飞船旋转
    function enemy_ship_revolve(enemy_ship) {
        var i = 0;

        function revolve() {
            enemy_ship.css('background-position', '-' + i + 'px 0px');
            i += 58;
            if (i > 174) i = 0;
        }
        tid = setInterval(revolve, 100);
    }

    // 添加飞船
    function add_enemy_ship() {
        var shipId;
        var id = parseInt(Math.random() * 3) + 1;
        if (id == 1) {
            shipId = 'one';
        } else if (id == 2) {
            shipId = 'two';
        } else if (id == 3) {
            shipId = 'three';
        }
        // 飞碟的随机出现
        var str = '<div class=\"enemy_ship enemy_ship_' + shipId + '\" ' +
            'style=\"position:absolute;left:750px;top:' +
            // 随机出现0~300的数
            (parseInt(Math.random() * 300) + 1) +
            'px\"></div>';
        // 可能更改的地方   
        $('.game').append(str);

        // 清除计时器
        clearInterval(tid);
        // 飞碟自转
        enemy_ship_revolve($('.enemy_ship'));
        // 飞船动画
        $('.enemy_ship').animate({
            left: '-85px'
        }, 5500, 'linear', function() {
            remove_obj($('.enemy_ship'), 60)
        });

    }

    // 添加行星
    function add_planet() {
        var planetId;
        var id = parseInt(Math.random() * 4) + 1;
        if (id == 1) {
            var planetId = 'brown';
        } else if (id == 2) {
            var planetId = 'dark';
        } else if (id == 3) {
            var planetId = 'gray';
        } else if (id == 4) {
            var planetId = 'gray_2';
        }
        var str = '<img src=\"./img/aestroid_' + planetId + '.png\" ' +
            'class=\"planet_all planet_' + planetId + '\" ' +
            'style=\"position:absolute;left:750px;top:' +
            // 随机出现0~300的数
            (parseInt(Math.random() * 300) + 1) +
            'px\">';

        $('.game').append(str);

        // 行星向右运动
        $('.planet_all').animate({
            left: '-100px'
        }, 7000, 'linear', function() {
            remove_obj($('.planet_all'), 100)
        });


    }

    // 随机生成不可碰撞行星
    function add_planet_nobump() {
        var arr = [
            '<img src=\"./img/planets/001-earth-globe.png\" class=\"planet_nobumpAll planet_nobump_8\" ',
            '<img src=\"./img/planets/001-global.png\" class=\"planet_nobumpAll planet_nobump_1\" ',
            '<img src=\"./img/planets/001-jupiter.png\" class=\"planet_nobumpAll planet_nobump_12\" ',
            '<img src=\"./img/planets/001-mars.png\" class=\"planet_nobumpAll planet_nobump_6\" ',
            '<img src=\"./img/planets/001-saturn.png\" class=\"planet_nobumpAll planet_nobump_9\" ',
            '<img src=\"./img/planets/001-travel.png\" class=\"planet_nobumpAll planet_nobump_2\" ',
            '<img src=\"./img/planets/001-uranus.png\" class=\"planet_nobumpAll planet_nobump_10\" ',
            '<img src=\"./img/planets/002-planet-earth.png\" class=\"planet_nobumpAll planet_nobump_11\" ',
            '<img src=\"./img/planets/002-planet-earth-1.png\" class=\"planet_nobumpAll planet_nobump_7\" ',
            '<img src=\"./img/planets/002-science.png\" class=\"planet_nobumpAll planet_nobump_5\" ',
            '<img src=\"./img/planets/002-science-1.png\" class=\"planet_nobumpAll planet_nobump_4\" ',
            '<img src=\"./img/planets/002-science-2.png\" class=\"planet_nobumpAll planet_nobump_3\" '
        ];
        var n = (parseInt(Math.random() * 12));

        var str = arr[n] +
            'style = \"position:absolute;left:750px;top:' +
            // 随机出现0~300的数
            (parseInt(Math.random() * 300) + 1) +
            'px\">';

        $('.game').append(str);
        if (n < 7) {
            $('.planet_nobumpAll').animate({
                left: '-150px'
            }, 3500, 'linear', function() {
                remove_obj($('.planet_nobumpAll'), 100)
            });
        } else {
            $('.planet_nobumpAll').animate({
                left: '-150px'
            }, 5000, 'linear', function() {
                remove_obj($('.planet_nobumpAll'), 100)
            });
        }

    }

    // 清除行星以及飞碟
    function remove_obj(obj, location) {
        for (var i = 0; i < obj.length; i++) {
            var position = obj.eq(i).position();
            var left = position.left;
            if (left < -location) {
                obj.eq(i).remove();
            }
        }
    }

    // 随机生成油桶
    function add_energy() {
        var str = '<img src=\"./img/addtime.png\" ' +
            'class=\"energy\" style=\"position: absolute;top:-40px;left: ' +
            // 随机出现0~750的数
            (parseInt(Math.random() * 550) + 1) +
            'px;\">';

        $('.game').append(str);

        // 油桶向下运动
        $('.energy').animate({
            top: '390px'
        }, 6000, 'linear', function() {
            energy_remove();
        });
    }

    // 到达后清除油桶
    function energy_remove() {
        for (var i = 0; i < $('.energy').length; i++) {
            var position = $('.energy').eq(i).position();
            var top = position.top;
            if (top > 380) {
                $('.energy').eq(i).remove();
            }
        }
    }

    // 刷新监听
    function monitor() {
        setIntervalId5 = setInterval(() => {
            // 监听移动飞船
            moveHero_Ship();
            // 监听进度条变化
            $('.jdt_n').text(jdtTime);
            $('.jdt_w>.jdt_n').css('width', jdtWidth);
            // 监听飞船碰撞
            bumpObj($('.enemy_ship')); // 敌方飞船
            bumpObj($('.planet_all')); // 可撞击小行星
            bumpObj($('.energy')); // 油桶
            // 监听子弹碰撞
            bulletBump($('.enemy_ship')); // 敌方飞船
            bulletBump($('.planet_all')); // 可撞击小行星

        }, 15);

    }

    // 飞船撞击事件
    function bumpObj(obj) {
        var heroPosition = $(".hero_ship").position();
        var heroTop = heroPosition.top;
        var heroLeft = heroPosition.left;

        for (var i = 0; i < obj.length; i++) {
            var enemyPosition = obj.eq(i).position();
            var enemyTop = enemyPosition.top;
            var enemyLeft = enemyPosition.left;
            var h2 = obj.height();
            var w2 = obj.width();
            // 判断
            if ((enemyTop - heroTop) < 70 && (enemyTop - heroTop) > -h2) {
                if ((enemyLeft - heroLeft) < 70 && (enemyLeft - heroLeft) > -w2) {

                    if (obj.hasClass('enemy_ship')) {
                        obj.eq(i).remove();
                        bumpLessTime();
                    } else if (obj.hasClass('planet_all')) {
                        obj.eq(i).remove();
                        bumpLessTime();
                    } else if (obj.hasClass('energy')) {
                        // 加时间函数
                        energyAddTime();
                        obj.eq(i).remove();
                    }

                }
            }
        }
    }
    // 子弹碰撞
    function bulletBump(obj) {
        for (var z = 0; z < $('.bullet').length; z++) {
            var bulletPosition = $(".bullet").eq(z).position();
            var bulletTop = bulletPosition.top;
            var bulletLeft = bulletPosition.left;

            for (var i = 0; i < obj.length; i++) {
                var enemyPosition = obj.eq(i).position();
                var enemyTop = enemyPosition.top;
                var enemyLeft = enemyPosition.left;
                var h2 = obj.eq(i).height();
                // 判断是否碰撞
                if ((enemyTop - bulletTop) < 15 && (enemyTop - bulletTop) > -h2) {
                    if ((enemyLeft - bulletLeft) < 35 && (enemyLeft - bulletLeft) > 0) {
                        // 子弹移除
                        $('.bullet').eq(z).remove();
                        // 判断对象
                        if (obj.hasClass('enemy_ship')) {
                            if (obj.hasClass('enemy_ship_two')) {
                                getScore -= 10;
                            } else {
                                getScore += 5;
                            }
                            // 移除被攻击对象
                            obj.eq(i).remove();
                        } else if (obj.hasClass('planet_all')) {
                            if (obj.eq(i).attr('hp') == 1) {
                                getScore += 10;
                                obj.eq(i).remove();
                            } else {
                                obj.eq(i).attr('hp', '1');
                            }
                        }
                        $('.count_score>p').text(getScore);
                        $('#destroyedAudio').get(0).play();
                    }
                }

            }
        }
    }
    // 吃油桶添加时间
    function energyAddTime() {
        clearInterval(setIntervalId7);
        jdtTime += 15;
        jdtWidth += 75;
        if (jdtTime >= 30) {
            jdtTime = 30;
            jdtWidth = 150;
        }
        progressControl();
    }
    // 撞击减少时间
    function bumpLessTime() {
        clearInterval(setIntervalId7);
        jdtTime -= 15;
        jdtWidth -= 75;
        // 进度条为0了  结束游戏
        if (jdtTime <= 0) {
            // 游戏结束
            gameOver();
        } else {
            progressControl();
        }
    }

    // 动画开始
    function playAnimate() {
        // 飞船动画
        $('.enemy_ship').animate({
            left: '-85px'
        }, 2000, 'linear', function() {
            remove_obj($('.enemy_ship'), 60)
        });
        // 行星向右运动
        $('.planet_all').animate({
            left: '-100px'
        }, 4000, 'linear', function() {
            remove_obj($('.planet_all'), 100)
        });
        // 油桶向下运动
        $('.energy').animate({
            top: '390px'
        }, 2500, 'linear', function() {
            energy_remove();
        });
        // 子弹向右运动
        $('.bullet').animate({
            left: 760
        }, 1200, 'linear', function() {
            remove_bullet();
        });
        // 不可碰撞行星
        $('.planet_nobumpAll').animate({
            left: '-150px'
        }, 2300, 'linear', function() {
            remove_obj($('.planet_nobumpAll'), 100)
        });
    }

    // 移除元素
    function removeAllObj(obj) {
        for (var i = 0; i < obj.length; i++) {
            obj.eq(i).remove()
        }
    }

    // 判断进度条小于等于 0 时游戏结束

    function gameOver() {

        if (jdtTime <= 0) {
            jdtTime = 0;
            jdtWidth = 0;
            $('.hero_ship').hide();
            $('.jdt_n').text(jdtTime);
            $('.jdt_w>.jdt_n').css('width', jdtWidth);
            // 暂停游戏
            gameRuning = false;
            // 清除计时器
            clearInterval(setIntervalId1);
            clearInterval(setIntervalId2);
            clearInterval(setIntervalId3);
            clearInterval(setIntervalId4);
            clearInterval(setIntervalId5);
            clearInterval(setIntervalId6);
            clearInterval(setIntervalId7);
            // 移除元素
            removeAllObj($('.bullet'));
            removeAllObj($('.enemy_ship'));
            removeAllObj($('.planet_nobumpAll'));
            removeAllObj($('.planet_all'));
            removeAllObj($('.energy'));

            // 显示游戏结束页面

            $('.GameOver').show();
        } else {
            return;
        }
    }

    // 数组对象排序
    function compare(one, two) {
        return function(a, b) {
            var value1 = a[one];
            var value2 = b[one];
            if (value1 === value2) {
                var twoValue1 = a[two];
                var twoValue2 = b[two];
                return twoValue1 - twoValue2;
            } else if (value1 - value2 < 0) {
                return 1;
            } else if (value1 - value2 > 0) {
                return -1;
            }
        }
    }
}())