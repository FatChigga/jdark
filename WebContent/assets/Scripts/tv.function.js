function Private() {}

Private.prototype.getFocusInfo = function(sets, target, direction) {
    function compare(idx, x, y, storage) {
        var tx = Math.abs(x), ty = Math.abs(y);
        if(storage) {
            var dvalueX = Math.min(storage.x, tx), dvalueY = Math.min(storage.y, ty);
            if(dvalueX === tx && dvalueY === ty) {
                return {idx: idx, x: dvalueX, y: dvalueY};
            } else {
                return {idx: storage.idx, x: storage.x, y: storage.y};
            }
        } else {
            return {idx: idx, x: tx, y: ty};
        }
    }
    var focusInfo = [];
    var currPos = target.offset();
    var up, right, down, left;
    var i = 0, index = sets.index(target);
    do {
        if(i != index) {
            var nextPos = sets.eq(i).offset();
            var x = Math.abs(currPos.left)-Math.abs(nextPos.left);
            var y = Math.abs(currPos.top)-Math.abs(nextPos.top);
            if(x >= 0 && y > 0) up = compare(i, x, y, up);
            if(x < 0 && y >= 0) right = compare(i, x, y, right);
            if(x >= 0 && y < 0) down = compare(i, x, y, down);
            if(x > 0 && y >= 0) left = compare(i, x, y, left);
        }
    } while(++i < sets.length);
    if(direction == 0) {
        return left == undefined ? left : sets.eq(left.idx);
    } else if(direction == 1) {
        return right == undefined ? right : sets.eq(right.idx);
    } else if(direction == 2) {
        return up == undefined ? up : sets.eq(up.idx);
    } else if(direction == 3) {
        return down == undefined ? down : sets.eq(down.idx);
    }
};

Private.prototype.setFocus = function(target, skip, callback) {
    if(target) {
        target[0].focus();
        $('.link').removeClass('on');
        target.parents('.link').addClass('on');
    } else if(skip) {
        if(callback) callback();
        skip[0].focus();
        $('.link').removeClass('on');
        skip.parents('.link').addClass('on');
    }
}

Private.prototype.linkage = function(direction) {
    var contain = $('.nav ul'), containLeft = parseFloat(contain.css('left'));
    var navList = $('.nav li'), currLi = $('.nav ul li.on'), idx = currLi.index();
    var visibleView = parseFloat($('.nav .list').width());
    var scrollWide = parseFloat(contain.width()) - visibleView + 30;
    if(direction == 0) {
        if(idx > 0) {
            var move = containLeft + navList.eq(idx).outerWidth(true);
            if(move > 0) move = 0;
            contain.css({left: move});
            navList.eq(--idx).addClass('on').siblings().removeClass('on');
            if(scrollWide > 0) $('.nav .point').show();
            if(idx == 0) $('.video .point').hide();
        }
    } else if(direction == 1) {
        var maxIdx = navList.length-1;
        if(idx < maxIdx) {
            var move = containLeft - navList.eq(idx).outerWidth(true);
            if(Math.abs(move) > scrollWide) move = -scrollWide;
            if(currLi.position().left > parseInt(visibleView/2)) contain.css({left: move});
            navList.eq(++idx).addClass('on').siblings().removeClass('on');
            if(idx == maxIdx) $('.nav .point').hide();
            if(maxIdx > 0) $('.video .point').show();
        }
    }
}

var IPTV = {};

$(function() {
    var private = new Private();

    var Focus = {
        video: function(target, direction, callback, page) {
            var next = private.getFocusInfo($('.video a'), target, direction);
            if(direction == 0) {
                if($('.nav li.on').index() > 0) {
                    private.setFocus(next, $('.video li:first-child a'), function() {
                        private.linkage(direction);
                        if(callback) callback();
                    });
                } else {
                    private.setFocus(next, target);
                }
            } else if(direction == 1) {
                if($('.nav li.on').index() < $('.nav li').length-1) {
                    private.setFocus(next, $('.video li:first-child a'), function() {
                        private.linkage(direction);
                        if(callback) callback();
                    });
                } else {
                    private.setFocus(next, target);
                }
            } else if(direction == 2) {
                if(page[0] > 1) {
                    if($('.nav')[0]) {
                        private.setFocus(next, $('.nav li.on a'), callback);
                    } else {
                        private.setFocus(next, $('.menu li:first-child a'), callback);
                    }
                } else {
                    if($('.nav')[0]) {
                        private.setFocus(next, $('.nav li.on a'));
                    } else {
                        private.setFocus(next, $('.menu li:first-child a'));
                    }
                }
            } else if(direction == 3) {
                if(page[0] < page[1]) {
                    private.setFocus(next, $('.video li:first-child a'), callback);
                } else {
                    private.setFocus(next, target);
                }
            } else if(direction == 4) {
                private.setFocus(undefined, $('.video li:first-child a'), callback);
            }
        },
        nav: function(direction, callback) {
            var next = private.getFocusInfo($('.nav li a'), $('.nav li.on a'), direction);
            if(direction == 0 || direction == 1) {
                var idx = $('.nav li.on').index();
                if(idx > 0 || idx < $('.nav li').length-1) {
                    private.linkage(direction);
                    private.setFocus(undefined, $('.nav li.on a'), callback);
                } else {
                    private.setFocus(next, $('.nav li a:focus'));
                }
            } else if(direction == 2) {
                private.setFocus(next, $('.top li:first-child a'));
            } else if(direction == 3) {
                private.setFocus(next, $('.video li:first-child a'));
            }
        },
        menu: function(target, direction) {
            var next = private.getFocusInfo($('.menu li > .link a'), target, direction);
            if(direction == 3) {
                if(target[0] == $('.menu li:last-child a')[0]) {
                    private.setFocus(next, $('.top .sort-items a').first());
                } else {
                    if($('.nav')[0]) {
                        private.setFocus(next, $('.nav li.on a'));
                    } else {
                        private.setFocus(next, $('.video li:first-child a'));
                    }
                }
            } else if(direction == 0) {
                if(target[0] == $('.menu li:first-child a')[0]) {
                    if($('.nav')[0]) {
                        private.setFocus(next, $('.nav li.on a'));
                    } else {
                        private.setFocus(next, target);
                    }
                } else {
                    private.setFocus(next, target);
                }
            } else if(direction == 1 || direction == 2) {
                private.setFocus(next, target);
            }
        },
        sort: function(target, direction) {
            var next = private.getFocusInfo($('.sort-items a'), target, direction);
            if(direction == 0) {
                if($('.nav')[0]) {
                    private.setFocus(next, $('.nav li.on a'));
                } else {
                    private.setFocus(next, target);
                }
            } else if(direction == 1) {
                private.setFocus(next, target);
            } else if(direction == 2) {
                private.setFocus(next, $('.top .sort > .link a'));
            } else if(direction == 3) {
                private.setFocus(next, $('.video li:first-child a'));
            }
        }
    };

    IPTV.Focus = Focus;
});
