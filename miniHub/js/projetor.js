var indiceAtual = -1;
var video = "";

$(function() {
	try {
		// parent.testeButon();
		player = new Video("video");
		carregaSource();
		initObserver();
	} catch (e) {
	}
});

function initObserver() {
	var intervalo = window.setInterval(verificaIndece, 1000);
}

function endObserver() {
	clearInterval(intervalo);
}

function verificaIndece() {
	var indicePai = parent.indice;
	if (indicePai != indiceAtual) {
		indiceAtual = indicePai;
		initVideo();
		endObserver()
	}
}

function carregaSource() {
	for (var i = 1; i <= 49; i++) {
		var urlVideo = "video/video" + i + ".mp4";
		player.addSource(new SourceVideo(urlVideo));
	}

}

function initVideo() {
	try {
		parent.exibiNext(false);
		parent.exibiPrev(false);
	} catch (e) {
		// TODO: handle exception
	}
	player.intiVideo(indiceAtual);

}

function acopanhaVideo(currentTime, duration) {
	player.onTrackedVideoFrame(currentTime, duration);
	$('#duracao').val(duration);
	$('#time').val(currentTime);
}

function encerraVideo() {
	try {
		initObserver();
		if (indiceAtual < 8) {
			parent.exibiNext(true);
		}
		if (indiceAtual > 0) {
			parent.exibiPrev(true);
		}
	} catch (e) {
		// TODO: handle exception
	}

}
