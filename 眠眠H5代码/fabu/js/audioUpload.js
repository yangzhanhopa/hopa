var part={key:"",uploadId:"",jobId:"",state:"",intervalId:0,audioUrl:""};

/**
 * 获取uploadId
 * @param $audioFile
 */
function getUploadId(area){
    var btnFile = $('input[type="file"]',area)
    btnFile.change(function(){
        var _this = $(this);
        var form = new FormData();
        var file = _this[0].files[0],  //文件对象
            name = file.name;        //文件名
        $.ajax({
            url: "/vrs/api/getUploadId.jsn?name="+name,
            type: "GET",
            async: true,        //异步
            processData: false,  //很重要，告诉jquery不要对form进行处理
            contentType: false,  //很重要，指定为false才能形成正确的Content-Type
            success: function (data) {
                console.log(data)
                var status = data.status;
                if(status == 1){
                    part.key = data.data.key;
                    part.uploadId = data.data.multipartUploadId;
                    var label = area.find('.choose');
                    label.removeClass('backgroundFlash').html('<p>'+name+'</p>'+'<span>音频选择完毕</span>');
                    $('.upload',area).addClass('backgroundFlash').click(function(){
                        $('.choose',area).find('span').text('上传中……0%')
                        uploadMultipart(0,file,area);
                        $(this).removeClass('backgroundFlash').addClass('wait');
                    });
                    var _name = area.parents('.edit_audio_box').attr('data-name');
                    $(".preview_wrap .audio_box[data-name='"+_name+"'] p").text(name.split('.')[0]);
                }
            }
        })
    })
}

/**
 * 分片上传音频
 * @param i
 * @param file
 */
function uploadMultipart (i,file,area){
    i = parseInt(i);
    var size = file.size,        //总大小
        shardSize = 2 * 1024 * 1024,    //以2MB为一个分片
        j = Math.ceil(size/shardSize),  //总片数
        k = parseInt(0);
    if(i==j){
        return
    };
    var statusArea = $('.choose',area).find('span');
    //计算每一片的起始与结束位置
    var start = i * shardSize,
        end = Math.min(size, start + shardSize);
    //构造一个表单，FormData是HTML5新增的
    var form = new FormData();
    form.append("data", file.slice(start, end));
    form.append("total", j);  //总片数
    form.append("index", i + 1);        //当前是第几片
    //form.append("random", random);        //唯一标示，随机数
    form.append("key", part.key);        //文件最终路径
    form.append("uploadId", part.uploadId);        //uploadId唯一标示
    //Ajax提交
    $.ajax({
        url: "/vrs/api/multipartUpload.jsn",
        type: "POST",
        data: form,
        async: true,        //异步
        processData: false,  //很重要，告诉jquery不要对form进行处理
        contentType: false,  //很重要，指定为false才能形成正确的Content-Type
        success: function (data) {
            //显示上传状态
            var rate = (i+1)/j;
            k = parseInt(Math.random()*100/j)+parseInt(i/j*100);
            statusArea.text('上传中……'+k+'%')
            uploadMultipart(i+1,file,area);
            //如果是最后一片则进行转码等工作
            if(rate==1){
                var status = data.status;
                if(status ==1){
                    part.audioUrl = data.data.path;
                    part.jobId = data.data.job.jobId;
                    var state = data.data.job.state;
                    //定时任务检查转码状态
                    part.intervalId = setInterval(function(){
                        getAudioJobProgress(statusArea,k);
                        k<100 && k++;
                    },2000);
                }
            }
        }
    })
}

/**
 * 获取音频转码进度
 */
function getAudioJobProgress(statusArea,k){
    $.ajax({
        url: "/vrs/api/checkAudio.jsn?jobId="+part.jobId,
        type: "GET",
        async: true,        //异步
        processData: false,  //很重要，告诉jquery不要对form进行处理
        contentType: false,  //很重要，指定为false才能形成正确的Content-Type
        success: function (data) {
            var status = data.status;
            if(status == 1){
                var state = data.data.state;
                //显示上传状态
                switch(state){
                    case "Submitted":
                        statusArea.text('上传中……'+k+'%');
                        break;
                    case "Transcoding":
                        statusArea.text('上传中……'+k+'%');
                        break;
                    case "TranscodeSuccess":
                        statusArea.text('上传完成');
                        setTimeout(function(){
                            statusArea.fadeOut();
                        },2000)
                        clearInterval(part.intervalId);
                        var $aud = statusArea.parents('.edit_audio_box');
                        var _name = $aud.attr('data-name');
                        var src = "http://audio.mingjuer.tv/"+data.data.output.outputFile.object;
                        $aud.find('.upload').remove();
                        $aud.find('input').remove();
                        $aud.find('.audio_local').removeClass('audioNot');
                        $(".preview_wrap .audio_box[data-name='"+_name+"'] audio")[0].pause();
                        $(".preview_wrap .audio_box[data-name='"+_name+"'] .play").show();
                        $(".preview_wrap .audio_box[data-name='"+_name+"'] .pause").hide();
                        $('.preview_wrap .audio_box[data-name="'+_name+'"] audio').attr({'src':src});
                        console.log(data.data)
                        break;
                }
            }
        }
    })
}