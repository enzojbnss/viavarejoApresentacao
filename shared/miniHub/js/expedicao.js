var checkBoxGroup = [];
var respondido = false;
var complemeto = "";
var chkSelecionado = false;
var estilo = "";

$(function() {
	try {
		parent.testeButon();
		estilo = parent.getEstilo()
	} catch (e) {
		estilo = "conteudo"
	}
	$("#corpo").addClass(estilo);
	initVideo()	
});


function initVideo() {
	parent.exibiNext(false);
	parent.exibiPrev(false);
	player = new Video("video");
	player.addSource(new SourceVideo("video/expedicao/" + estilo + ".mp4"));
	player.intiVideo();
}

function acopanhaVideo(currentTime, duration) {
	player.onTrackedVideoFrame(currentTime, duration);
	$('#duracao').val(duration);
	$('#time').val(currentTime);
}
function encerraVideo() {
	parent.exibiNext(true);
	if (estilo == "conteudo") {
		parent.exibiPrev(true);
	}
}


