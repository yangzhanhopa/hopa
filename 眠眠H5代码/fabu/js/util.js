$(function () {
    // repair();
    $('.addBtn').click(function () {
        addEdit($(this).attr("data-add"));
    })
})

// var videoStop = false;
// var audioStop = false;
var countnum = 0;

// 修改功能
function repair() {
    var str = window.location.search;
    var pos_start = str.indexOf('repairId') + 9;
    var pos_end = str.indexOf("&", pos_start);
    var newsId = pos_end == -1 ? decodeURIComponent(str.substring(pos_start)) : decodeURIComponent(str.substring(pos_start, pos_end));
    if (newsId) {
        /*RGB颜色转换为16进制*/
        String.prototype.colorHex = function () {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var that = this;
            if (/^(rgb|RGB)/.test(that)) {
                var aColor = that.replace(/(?:|\(|\)|\s|rgb|RGB)*/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = that;
                }
                return strHex;
            } else if (reg.test(that)) {
                var aNum = that.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return that;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return that;
            }
        };

        // var _url = 'http://data.mingjuer.tv/info/detail/getDetailInfoById?id=' + newsId;
        // $.ajax({
        //     type: 'get',
        //     url: _url,
        //     dataType: "jsonp",
        //     success: function (i) {
        //         var _html = $(decodeURIComponent(i.data.data));
        //         var _share = decodeURIComponent(i.data.wxdata);
        //         var _tit = decodeURIComponent(i.data.description);
        //
        //         //edit_head
        //         var _head = $('.edit_head');
        //         _share = typeof(_share) == "object" ? _share : eval("(" + _share + ")");
        //         var _des = _share.text;
        //         var _img = _share.img;
        //         _head.find('.fabuName').val(_tit);
        //         _head.find('.wxText').val(_des);
        //         $('.wxImg', _head).find('img').attr('src', _img).css('display', 'inline').siblings('div').remove();
        //
        //         $('.preview_box').html(_html);
        //         var bgColor = $('.preview_wrap').css('backgroundColor');
        //         document.getElementById('bgColor').value = bgColor.colorHex();
        //
        //         //edit_body
        //         var wrap = $('.edit_wrap');
        //         var modules = $('.preview_wrap').children();
        //         var max = 1;
        //         $(".edit_foot").hide();
        //         for (var i = 0; i < modules.length; i++) {
        //             var _this = modules.eq(i);
        //             var num = Math.floor(_this.attr('data-name'));
        //             max = num > max ? num : max;
        //             var htmlHead = '<div class="edit_box">'
        //             var htmlBody = '';
        //             var tType = '';
        //             switch (_this.attr('class')) {
        //                 case "text_box":
        //                     htmlBody = addText(num, _this.html(), parseInt(_this.css("paddingLeft")));
        //                     tType = '<i class="iconfont">&#xe606;</i>';
        //                     break;
        //                 case "img_box":
        //                     htmlBody = addImg(num, _this.children('img').attr('src'), parseInt(_this.children('img')[0].style.width), _this.css('textAlign'), parseInt(_this.css('paddingLeft')));
        //                     tType = '<i class="iconfont">&#xe60c;</i>';
        //                     break;
        //                 case "video_box":
        //                     htmlBody = addVideo(num, _this.find('iframe'));
        //                     tType = '<i class="iconfont">&#xe60d;</i>';
        //                     break;
        //                 case "audio_box":
        //                     htmlBody = addAudio(num, _this.children('audio').attr('src'), _this.children('p').text());
        //                     tType = '<i class="iconfont">&#xe60a;</i>';
        //                     break;
        //                 case "blank_box":
        //                     htmlBody = addBlank(num, parseInt(_this.css('height')));
        //                     tType = '<i class="iconfont">&#xe60e;</i>';
        //                     break;
        //             }
        //             var htmlFoot = '<div class="tool_box"><div class="tool_num">' + tType + '</div><div class="tool_btn tool_up" onclick="shiftUp(this)"><i class="iconfont">&#xe602;</i></div><div class="tool_btn tool_down" onclick="shiftDown(this)"><i class="iconfont">&#xe601;</i></div><div class="tool_btn tool_delete" onclick="shiftDel(this)"><i class="iconfont">&#xe600;</i></div> </div></div>';
        //             $('.edit_wrap').append(htmlHead + htmlBody + htmlFoot);
        //         }
        //         countnum = max;
        //     }
        // })
    }
}

// 改变背景色
function changeBC(me) {
    var _color = $(me).val();
    $('.edit_wrap .text_box,.preview_wrap').css({"background-color": _color});
}

// 上传富文本
function preText(me) {
    var _this = $(me);
    if (_this.attr("contenteditable") == "false") {
        _this.popline({position: "fixed"});
        _this.attr("contenteditable", "true");
        $('.popline:last .popline-justifyLeft-button,.popline:last .popline-justifyCenter-button,.popline:last .popline-justifyRight-button').on('click', function (e) {
            retextC(me);
        })
        $(me).on('DOMNodeInserted keyup', function (e) {
            retextC(me);
        })

        _this.focus();

    }
}

// 上传图片2
function preImg(me) {
    var _this = $(me);
    var inputs = _this.find('input[type="file"]');
    inputs[0].click();
    inputs.on("change", function () {
        var _form = $(this).parent('form');
        console.log(inputs)
        console.log(_form);
        _form.ajaxSubmit(function (data) {
            console.log(data)
            var status = data.status;
            var objUrl = data.data;
            console.log(objUrl)
            if (status == 200) {
                _this.children('img').attr("src", objUrl.url).show().siblings('div').remove();
                $(".preview_wrap .img_box[data-name='" + _this.attr('data-name') + "']").children('img').attr("src", objUrl.url);
            }
        });
        // _form.submit()
        inputs.off();
    })
}
function wxImg(me) {
    var _this = $(me);
    var inputs = _this.find('input[type="file"]');
    inputs[0].click();
    inputs.on("change", function () {
        var _form = $(this).parent('form');
        _form.ajaxSubmit(function (data) {
            console.log(data)
            var status = data.status;
            var objUrl = data.data;
            console.log(objUrl)
            if (status == 200) {
                _this.children('img').attr("src", objUrl.url).show().siblings('div').remove();
            }
        });
        inputs.off();
    })
}

//建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

// 添加编辑模块
function addEdit(me) {
    var allLen = $('.edit_box').length + 1;
    var htmlHead = '<div class="edit_box">';
    var htmlBody = '';
    var tType = '';
    var needSel = false;

    if (me == "addImg") {
        htmlBody = addImg();
        tType = '<i class="iconfont">&#xe60c;</i>';
    } else if (me == "addText") {
        htmlBody = addText();
        tType = '<i class="iconfont">&#xe606;</i>';
    } else if (me == "addAudio") {
        if ($('.edit_wrap').find('.audioNot').length > 0) {
            tipShow('请成功上传音频后再添加下一个')
            return false;
        } else {
            needSel = 'audio';
            htmlHead = '<div class="edit_box audio_wrap">';
            htmlBody = addAudio();
            tType = '<i class="iconfont">&#xe60a;</i>';
        }
    } else if (me == "addVideo") {
        if ($('.edit_wrap').find('.videoNot').length > 0) {
            tipShow('请成功上传视频后再添加下一个')
            return false;
        } else {
            needSel = 'video';
            htmlHead = '<div class="edit_box video_wrap">';
            htmlBody = addVideo();
            tType = '<i class="iconfont">&#xe60d;</i>';
        }
    } else if (me == "addBlank") {
        htmlBody = addBlank();
        tType = '<i class="iconfont">&#xe60e;</i>';
    }

    var htmlFoot = '<div class="tool_box"><div class="tool_num">' + tType + '</div><div class="tool_btn tool_up" onclick="shiftUp(this)"><i class="iconfont">&#xe602;</i></div><div class="tool_btn tool_down" onclick="shiftDown(this)"><i class="iconfont">&#xe601;</i></div><div class="tool_btn tool_delete" onclick="shiftDel(this)"><i class="iconfont">&#xe600;</i></div> </div></div>';

    $('.edit_wrap').append(htmlHead + htmlBody + htmlFoot);

    if (needSel == 'audio') {
        $('.body_mask').show();
        $('.choose_type').find('.local').text('本地音频');
        $('.choose_type').find('.link').text('外链音频');
        chooseAudioType();
        $('.choose_type').show();
    } else if (needSel == 'video') {
        $('.body_mask').show();
        $('.choose_type').find('.local').text('本地视频');
        $('.choose_type').find('.link').text('外链视频');
        chooseVideoType();
        $('.choose_type').show();
    } else {
        moveToBottom();
    }

    reshift();
}

function moveToBottom() {
    $('.body_secound').animate({scrollTop: '999999999px'}, 0);
}

// 选择上传音频类型
function chooseAudioType() {
    var btnwrap = $('.choose_type');
    var btn1 = $('.local', btnwrap);
    var btn2 = $('.link', btnwrap);
    btn1.click(function () {
        $(this).add($(this).siblings()).removeClass('stopclick')
        var audioName;
        var wrap = $('.audio_wrap').last();
        var btn_choose = $('.choose', wrap);
        var btn_upload = $('.upload', wrap);
        btnwrap.hide();
        $('.body_mask').hide();
        $('.audio_link', wrap).remove();
        wrap.show();
        var area = $('.audio_local', wrap);
        getUploadId(area)
        btn1.off();
        btn2.off();
        moveToBottom();
    })
    btn2.click(function () {
        $(this).add($(this).siblings()).removeClass('stopclick')
        var audioName;
        var wrap = $('.audio_wrap').last();
        btnwrap.hide();
        $('.body_mask').hide();
        $('.audio_local', wrap).remove();
        wrap.show();
        btn2.off();
        btn1.off();
        moveToBottom();
    })
}

// 选择上传视频类型
function chooseVideoType() {
    var btnwrap = $('.choose_type');
    var btn1 = $('.local', btnwrap);
    var btn2 = $('.link', btnwrap);
    btn1.click(function () {
        $(this).add($(this).siblings()).removeClass('stopclick')
        var videoName;
        var wrap = $('.video_wrap').last();
        var btn_choose = $('.choose', wrap);
        var btn_upload = $('.upload', wrap);
        btnwrap.hide();
        $('.body_mask').hide();
        $('.video_link', wrap).remove();
        wrap.show();
        btn_choose.add(btn_upload).click(function () {
            $(this).removeClass('backgroundFlash')
        });
        moveToBottom();

        //选择视频
        btn_choose.addFile({
            addFile: function (data) { //添加文件时的回调
                videoName = data.data.fileName
                btn_choose.html('<p>' + videoName + '</p>' + '视频选择完毕')
                btn_upload.addClass('backgroundFlash')
            },
            addFileError: function (data) { //添加文件时发生错误的回调
                console.log("上传错误！错误消息：" + data.msg)
                btn_choose.html(data.msg).addClass('backgroundFlash')
            }
        });

        //开始上传
        btn_upload.upload({
            uploadInitUrl: "/vrs/api/html5UploadInit.jsn",//初始化上传地址
            uploadProgress: function (data) { //进度回调
                btn_choose.html('<p>' + videoName + '</p>' + '上传中……' + data.progress);
            },
            uploadFinish: function (data) { //上传完成回调
                videoStop = false;
                btn_choose.css('padding', 0)
                btn_choose.html("<img src='img/video.jpg'/><div><p>" + videoName + "</p><p><span>(假装这是视频)</span></p></div>");
                btn_choose.off();
                btn_upload.remove();
                console.log(videoInfo);
                var _name = btn_choose.parent().attr('data-name');
                var vu = videoInfo.video_unique;
                var _html = '<iframe width="250" height="150" frameborder="0" src="http://yuntv.letv.com/bcloud.html?uu=53f80d6851&vu=' + vu + '&gpcflag=1&width=250&height=150"></iframe>';
                $(".preview_wrap .video_box[data-name='" + _name + "']>div").css({
                    "transform": "scale(2) translate(125px,37.5px)",
                    "-webkit-transform": "scale(2) translate(125px,37.5px)",
                    "-o-transform": "scale(2) translate(125px,37.5px)",
                    "-moz-transform": "scale(2) translate(125px,37.5px)",
                    "-ms-transform": "scale(2) translate(125px,37.5px)"
                });
                $(".preview_wrap .video_box[data-name='" + _name + "']").css({"height": "300px"});
                $(".preview_wrap .video_box[data-name='" + _name + "']>div").html(_html);
                btn_choose.parents('.video_local').removeClass('videoNot');
            },
            uploadError: function (data) { //上传错误回调
                console.log("上传错误！错误消息：" + data.msg)
                btn_choose.html(data.msg).addClass('backgroundFlash')
            },
            uploadAbort: function (data) { //中断

            }
        });
        btn1.off();
        btn2.off();
    })
    btn2.click(function () {
        $(this).add($(this).siblings()).removeClass('stopclick')
        var videoName;
        var wrap = $('.video_wrap').last();
        btnwrap.hide();
        $('.body_mask').hide();
        $('.video_local', wrap).remove();
        wrap.show();
        btn2.off();
        btn1.off();
        moveToBottom();
    })
}

// 添加图片编辑模块
function addImg(e, src, width, align, padding) {
    var thisnum = e ? e : ++countnum;
    var width = width ? width : 100;
    var padding = padding ? padding : 0;
    var alignAry = [];
    if (align) {
        alignAry[0] = align == "left" ? 1 : 0;
        alignAry[1] = align == "center" ? 1 : 0;
        alignAry[2] = align == "right" ? 1 : 0;
    } else {
        alignAry = [0, 1, 0]
    }

    var html = '';
    html += '<div class="edit_img_box" data-name="' + thisnum + '">';
    html += '<div class="img_box" data-name="' + thisnum + '" onclick="preImg(this)">';
    // html += '<form enctype="multipart/form-data" action="http://59.110.168.49:8000/admin/v1/upload/image" method="post" style="display:none;"><input type="file" onclick="event.stopPropagation()" name="file' + thisnum + '" accept=".jpg,.png,.gif,.jpeg"></form>';
    html += '<form enctype="multipart/form-data" action="http://47.93.49.236:8000/admin/v1/upload/image" method="post" target="_blank" style="display:none;"><input type="file" onclick="event.stopPropagation()" name="file" accept=".jpg,.png,.gif,.jpeg"></form>';
    html += src ? '<img src="' + src + '" style="display:inline;">' : '<div class="hasnotImg">选择图片</div><img src="">';
    html += '</div><div>图片宽度： <input class="text low" type="number" value="' + width + '" max="100" min="0" onchange="reimgW(this)"> % (0-100)</div>'
    html += '<div class="align">对齐方式： '
    html += '<input type="radio" name="alignimg' + thisnum + '" value="left" onclick="reimgA(this)" '
    html += alignAry[0] == 1 ? 'checked' : '';
    html += '> <i class="iconfont" onclick="$(this).prev().click();">&#xe603;</i> <input type="radio" name="alignimg' + thisnum + '" value="center" onclick="reimgA(this)" '
    html += alignAry[1] == 1 ? 'checked' : '';
    html += '> <i class="iconfont" onclick="$(this).prev().click();">&#xe604;</i> <input type="radio" name="alignimg' + thisnum + '" value="right" onclick="reimgA(this)" '
    html += alignAry[2] == 1 ? 'checked' : '';
    html += '> <i class="iconfont" onclick="$(this).prev().click();">&#xe605;</i></div><div>左右边距： <input class="text low" type="number" value="' + padding + '" max="100" min="0" onchange="reimgP(this)"> px (0-100)</div></div>';

    // 添加提交列表
    // $("#up-box").append('<input type="file" class="img-file"  accept=".jpg,.png,.gif,.jpeg" name="img'+thisnum+'">');
    // 添加预览模块
    if (!e) {
        $(".preview_wrap").append('<div class="img_box" data-name="' + thisnum + '"><img src="/img/noimg.png" style="width:100%"></div>');
    }

    return (html);
}

// 添加文字编辑模块
function addText(e, text, dis) {
    var thisnum = e ? e : ++countnum;
    var text = text ? text : "在此输入文字内容";
    var dis = dis ? dis : 0;

    var html = '';
    html += '<div class="edit_text_box" data-name="' + thisnum + '">';
    html += '<div class="text_box" data-name="' + thisnum + '" contenteditable="false" onfocus="focusDis(this)" onblur="blurDis(this)" onclick="preText(this)" onblur="retextC(this)" style="background-color:' + $('.backColor>input').val() + '">' + text + '</div>';
    html += '<div>左右边距： <input class="text low" type="number" value="' + dis + '" max="100" min="0" onchange="retextP(this)"> px (0-100)</div><div>上下边距： 默认15px</div></div>';

    // 添加预览模块
    if (!e) {
        $(".preview_wrap").append('<div class="text_box" data-name="' + thisnum + '"><div>在此输入文字内容</div></div>');
    }

    return (html);
}

// 获取焦点文字消失
function focusDis(e) {
    var _this = $(e);
    if (_this.text() == "在此输入文字内容") {
        _this.html('<br/>')
    }
}
// 离开焦点添加提示文字
function blurDis(e) {
    var _this = $(e);
    if (!_this.text()) {
        _this.text('在此输入文字内容')
    }
}

// 添加音频编辑模块
function addAudio(e, src, p) {
    var thisnum = e ? e : ++countnum;
    var p = p ? p : '';
    var src = src ? src : "";

    var html = '';
    html += '<div class="edit_audio_box" data-name="' + thisnum + '">';
    // 本地
    if (!e) {
        html += '<div class="audio_local audioNot">'
        html += '<div class="audio_box" data-name="' + thisnum + '">'
        html += '<input type="file"/>'
        html += '<label class="choose backgroundFlash">选择本地音频</label>'
        html += '</div><button class="upload">开始上传</button></div>'
    }
    // 外链
    html += '<div class="audio_link">'
    html += '<div class="audio_box" data-name="' + thisnum + '">'
    html += '<div><input class="text" type="text" placeholder="输入音频标题" style="width:100%;" onblur="reaudioT(this)" value="' + p + '"></div>'
    html += '<div><input class="text" type="text" placeholder="输入音频链接" style="width:100%;" onblur="reaudioU(this)" value="' + src + '"></div></div></div>'

    // 添加预览模块
    if (!e) {
        $(".preview_wrap").append('<div class="audio_box" data-name="' + thisnum + '"><audio src="" loop></audio><p>未填写标题</p><div><i class="iconfont play" onclick="audioPlay(this)">&#xe611;</i><i class="iconfont pause" onclick="audioPause(this)">&#xe612;</i></div></div>');
    }

    return (html);
}

// 添加视频编辑模块
function addVideo(e, str) {
    var thisnum = e ? e : ++countnum;
    var str = str ? str.clone().empty()[0].outerHTML : "";

    var html = '';
    html += '<div class="edit_video_box" data-name="' + thisnum + '">';
    // 本地
    if (!e) {
        html += '<div class="video_local videoNot">'
        html += '<div class="video_box" data-name="' + thisnum + '">'
        html += '<label class="choose backgroundFlash">选择本地视频</label>'
        html += '</div><button class="upload">开始上传</button></div>'
    }
    // 外链
    html += '<div class="video_link">'
    html += '<div class="video_box" data-name="' + thisnum + '">'
    html += '<div><input class="text" type="text" placeholder="输入视频链接" style="width:100%;" onblur="revideoU(this)" value=\'' + str + '\'></div></div></div>'
    html += '</div>';

    // 添加预览模块
    if (!e) {
        $(".preview_wrap").append('<div class="video_box"  data-name="' + thisnum + '"><div><video src="" style="width:100%;height:100%">视频</video></div></div>');
    }

    return (html);
}

// 添加间隔编辑模块
function addBlank(e, height) {
    var thisnum = e ? e : ++countnum;
    var height = height ? height : 20;

    var html = '';
    html += '<div class="edit_blank_box" data-name="' + thisnum + '">';
    html += '<div class="blank_box" data-name="' + thisnum + '"></div>';
    html += '<div>间隔高度： <input class="text low" type="number" value="' + height + '" max="100" min="0" onchange="reblankP(this)"> px (0-100)</div></div>';

    // 添加预览模块
    if (!e) {
        $(".preview_wrap").append('<div class="blank_box" data-name="' + thisnum + '"></div>');
    }

    return (html);
}

// 编辑模块上移
function shiftUp(me) {
    var _this = $(me);
    var _parents = _this.parents(".edit_box");
    var _name = _parents.children().eq(0).attr("data-name");
    var _preview = $(".preview_wrap>[data-name='" + _name + "']");
    if (_parents.index() <= 0) {
        return false;
    } else {
        _parents.after(_parents.prev(".edit_box"));
        _preview.after(_preview.prev("div"));
        reshift();
    }
}

// 编辑模块下移
function shiftDown(me) {
    var _this = $(me);
    var _parents = _this.parents(".edit_box");
    var _name = _parents.children().eq(0).attr("data-name");
    var _preview = $(".preview_wrap>[data-name='" + _name + "']");
    if (_parents.index() >= $(".edit_box").length - 1) {
        return false;
    } else {
        _parents.before(_parents.next(".edit_box"));
        _preview.before(_preview.next("div"));
        reshift();
    }
}

// 编辑模块删除
function shiftDel(me) {
    $('.pop_delete').show();
    $('.body_mask').show();
    $('.pop_delete .no').on('click', function () {
        $('.pop_delete').hide();
        $('.body_mask').hide();
        $('.pop_delete .yes').off();
        $('.pop_delete .no').off();
    })
    $('.pop_delete .yes').on('click', function () {
        var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
        // $('#up-box').find('input[name="'+_name+'"]').remove();
        $(me).parents(".edit_box").remove();
        $(".preview_wrap>[data-name='" + _name + "']").remove();
        reshift();
        $('.pop_delete').hide();
        $('.body_mask').hide();
        $('.pop_delete .yes').off();
        $('.pop_delete .no').off();
    })
}

// 编辑模块操作后刷新
function reshift() {
    var len = $(".edit_box").length - 1;
    if (len <= -1) {
        $(".edit_foot").show();
    } else {
        $(".edit_foot").hide();
    }
    ;
    $(".edit_box .tool_btn").removeClass('off');
    $(".edit_box:eq(0) .tool_up").addClass('off');
    $(".edit_box:eq(" + len + ") .tool_down").addClass('off');
}


// 改变图片宽度
function reimgW(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val();
    if (_val >= 0 && _val <= 100) {
        //
    } else {
        _val = 100;
        $(me).val(100);
    }
    $(".preview_wrap .img_box[data-name='" + _name + "'] img").css({"width": _val + "%"});
}
// 改变图片边距
function reimgP(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val();
    if (_val >= 0 && _val <= 100) {
        //
    } else {
        _val = 0;
        $(me).val(0);
    }
    $(".preview_wrap .img_box[data-name='" + _name + "']").css({
        "padding-left": _val + "px",
        "padding-right": _val + "px"
    });
}
// 改变图片对齐
function reimgA(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val();
    $(".preview_wrap .img_box[data-name='" + _name + "']").css({"text-align": _val});
}


// 改变文字边距
function retextP(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val();
    if (_val >= 0 && _val <= 100) {
        //
    } else {
        _val = 0;
        $(me).val(0);
    }
    // $(me).parents(".edit_box").find(".text_box").css({"padding-left":_val+"px","padding-right":_val+"px"});
    $(".preview_wrap .text_box[data-name='" + _name + "']").css({
        "padding-left": _val + "px",
        "padding-right": _val + "px"
    });
}
// 改变文字内容
function retextC(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _html = $(me).html();
    $(".preview_wrap .text_box[data-name='" + _name + "']").html(_html);
}


// 改变音频标题
function reaudioT(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val().split('.')[0];
    $(".preview_wrap .audio_box[data-name='" + _name + "'] p").text(_val);
}
// 改变音频地址
function reaudioU(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val();
    $(".preview_wrap .audio_box[data-name='" + _name + "'] audio")[0].pause();
    $(".preview_wrap .audio_box[data-name='" + _name + "'] .play").show();
    $(".preview_wrap .audio_box[data-name='" + _name + "'] .pause").hide();
    $(".preview_wrap .audio_box[data-name='" + _name + "'] audio").attr({'src': _val});
}


// 改变视频地址
function revideoU(me) {
  console.log(me)
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    console.log($(me).val())

    var _val = $(me).val();
    var _video =$(".preview_wrap .video_box[data-name='" + _name + "'] video")
    console.log(_val)
    var oldwidth = _video.attr('width');
    var oldheight = _video.attr('height');
    var newheight = oldheight / oldwidth * 250;
    _video.attr({'width': '100%', 'height': '100%'});
    // $(".preview_wrap .video_box[data-name='" + _name + "']>div").css({
    //     "transform": "scale(2) translate(125px," + (newheight / 4) + "px)",
    //     "-webkit-transform": "scale(2) translate(125px," + (newheight / 4) + "px)",
    //     "-moz-transform": "scale(2) translate(125px," + (newheight / 4) + "px)",
    //     "-o-transform": "scale(2) translate(133px," + (newheight / 4) + "px)",
    //     "-ms-transform": "scale(2) translate(125px," + (newheight / 4) + "px)"
    // });
    $(".preview_wrap .video_box[data-name='" + _name + "']").css({"height": (newheight * 2) + "px"});
    $(".preview_wrap .video_box[data-name='" + _name + "'] video").attr({'src':_val});
}


// 改变间隔高度
function reblankP(me) {
    var _name = $(me).parents(".edit_box").children().eq(0).attr('data-name');
    var _val = $(me).val();
    if (_val >= 0 && _val <= 100) {
        //
    } else {
        _val = 20;
        $(me).val(20);
    }
    $(me).parents(".edit_box").find(".blank_box").css({"height": _val + "px"});
    $(".preview_wrap .blank_box[data-name='" + _name + "']").css({"height": _val + "px"});
}

// 弹窗
function tipShow(content) {
    var mask = $('.body_mask');
    var tip = mask.find('.tips');
    tip.children('p').html(content);
    mask.add(tip).show();
    mask.find('.back').click(function () {
        mask.add(tip).hide();
    })
}


// 刷新预览
function repreview(t) {
    if (t == 'all') {
        // 全面刷新

    } else {
        // 刷新元素

    }
}


function fabu() {
  console.log($('.preview_box').html())
  console.log($('.preview_box').html())
    if ($('.fabuName').val() == '') {
        tipShow('请填写页面主题');
    } else if ($('.preview_wrap').html() == '') {
        tipShow('未添加任何模块');
    } else if ($('.hasnotImg').length > 0) {
        tipShow('有图片未添加');
    } else {
        var wxdataJ = "{img:'" + $('.wxImg img').attr('src') + "',text:'" + $('.wxText').val() + "'}";
        $.ajax({
            //http://172.16.1.73:8080
            //?name="+encodeURIComponent($('.fabuName').val())+"&data="+encodeURIComponent($('.preview_box').html())
            url: "http://47.93.49.236:8000/admin/v1/article/create",
            type: "POST",
            contentType:"application/x-www-form-urlencoded",
            dataType:"json",
            data: {
                'name':$('.fabuName').val(),
                'content':$('.preview_box').html(),
            },
            success: function (data) {
                console.log(data);
                tipShow('生成的页面地址<br/><a target=_blank href="http://www.hopapapa.com/fabu/news.html?id=' + data.data.article_id + '">http://www.hopapapa.com/fabu/news.html?id=' + data.data.article_id + '</a>');
            },
            error:function (data) {
                console.log(data)
            }
        })
    }
}

// 预览页js
function audioPlay(me) {
    var $audio = $(me).parents('audio_box').siblings().find('audio');
    var $thisAudio = $(me).parent().siblings('audio');
    // 其它audio关闭
    $audio.each(function () {
        $(this)[0].pause();
    })
    $audio.siblings('div').find('.play').show();
    $audio.siblings('div').find('.pause').hide();

    $thisAudio[0].play();
    $(me).hide();
    $(me).next('.pause').show();
}
function audioPause(me) {
    var $thisAudio = $(me).parent().siblings('audio');

    $thisAudio[0].pause();
    $(me).hide();
    $(me).prev('.play').show();
}
