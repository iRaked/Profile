// i spent 5 hours straight trying to figure this out
// so pls don't steal thank uu
// i mean tbh it's mostly math but i almost failed math in high school sooo

// if u want to learn i can point you to the following sites:
// learning resource 01: www.w3schools.com/jsref/dom_obj_audio.asp
// learning resource 02: www.w3schools.com/tags/tag_audio.asp
// learning resource 03: developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Cross-browser_audio_basics

$(document).ready(function(){
    var ongaku = document.getElementById("symphonia"),
        bar = document.getElementById("gt-barwrap"),
        track = document.getElementById("gt-musictrack"),
        ovset = $("#glenplayer04").offset(),
        hidari = ovset.left;
    
    $(".playy, .pausee").click(function(){
        $(".playy, .pausee").toggle();
        if (ongaku.paused) {
            ongaku.play();
        } else { 
            ongaku.pause();
        }
    });
    
    ongaku.addEventListener("timeupdate", function(){
        var now = parseFloat(ongaku.currentTime),
            MP = "0" + Math.floor(now / 60),
            SP = "0" + (Math.floor(now) - MP * 60),
            _now = MP.substr(-2) + ":" + SP.substr(-2);
        track.style.width = parseInt
        (((ongaku.currentTime / ongaku.duration) * 100), 10) + "%";
        document.getElementById("music-duration").innerHTML = _now;
    });
    
    bar.addEventListener("click", function(T_T){
        var pin = (T_T.pageX - hidari - this.offsetLeft) / this.offsetWidth,
            point = pin * ongaku.duration;
        ongaku.currentTime = point;
    });
    
    ongaku.addEventListener("durationchange", function(){
        var origTimeA = document.getElementById("symphonia").duration,
            MO = "0" + Math.floor(origTimeA / 60), 
            SO = "0" + (Math.floor(origTimeA) - MO * 60),
            origTimeB = MO.substr(-2) + ":" + SO.substr(-2);
        document.getElementById("music-duration").innerHTML = origTimeB;
    });
    
    ongaku.onended = function(){
        $(".playy").show();
        $(".pausee").hide();
    };
});