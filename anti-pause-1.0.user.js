// ==UserScript==
// @name         学习通直播防暂停
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除学习通直播切屏暂停限制
// @author       You
// @match        *://zhibo.chaoxing.com/*
// @match        *://*.chaoxing.com/live/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log('🚀 学习通防暂停脚本已加载');

    // 等待页面完全加载
    function init() {
        // 1. 修改关键变量
        if (typeof window.isCanSwitchwindow !== 'undefined') {
            window.isCanSwitchwindow = true;
            console.log('✅ 已修改 isCanSwitchwindow = true');
        }

        // 2. 移除blur事件监听
        window.onblur = null;

        // 3. 阻止所有blur事件
        window.addEventListener('blur', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 4. 阻止focus事件
        window.addEventListener('focus', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 5. 修改页面可见性API
        Object.defineProperty(document, 'hidden', {
            configurable: true,
            get: function() { return false; }
        });

        Object.defineProperty(document, 'visibilityState', {
            configurable: true,
            get: function() { return 'visible'; }
        });

        // 6. 等待video元素加载
        let checkVideoInterval = setInterval(() => {
            let video = document.querySelector('video');
            if (video) {
                clearInterval(checkVideoInterval);
                console.log('✅ 找到视频元素');

                // 阻止视频暂停
                video.addEventListener('pause', function(e) {
                    console.log('🔴 检测到暂停，正在恢复播放...');
                    setTimeout(() => {
                        if (video.paused && !video.ended) {
                            video.play().catch(err => console.log('自动播放被阻止:', err));
                        }
                    }, 100);
                }, true);

                // 强制保持播放状态
                setInterval(() => {
                    if (video.paused && !video.ended) {
                        console.log('⚠️ 视频被暂停，强制恢复');
                        video.play().catch(err => console.log('自动播放被阻止:', err));
                    }
                }, 500);

                console.log('✅ 防暂停脚本已完全启动！');
            }
        }, 500);

        // 10秒后停止检查（避免无限循环）
        setTimeout(() => {
            clearInterval(checkVideoInterval);
        }, 10000);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 额外保险：延迟1秒再执行一次
    setTimeout(init, 1000);

})();