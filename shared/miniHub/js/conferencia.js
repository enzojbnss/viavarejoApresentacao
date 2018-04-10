var checkBoxGroup = [];
var respondido = false;
var complemeto = "";
var chkSelecionado = false;
var idquestao = 2;
var estilo = "";

$(function() {
	try {
		parent.testeButon();
		estilo = parent.getEstilo()
		if (estilo == "conteudo" ) {
			parent.exibiPrev(false);
			var txtPergunta = "";
			var txtResposta1 = "";
			var txtResposta2 = "";
			var txtResposta3 = "";
		}else{
			txtPergunta = "De acordo com o conteúdo estudado anteriormente no Manual Mini Hub, em qual tela o usuário poderá solicitar a aprovação das notas fiscais junto à SEFAZ?";
			var txtResposta1 = "S8CZ";
			var txtResposta2 = "S6CW";
			var txtResposta3 = "S8CV";
		}
		$("#dvtxtPergunta").text(txtPergunta);
		$("#lblAnwser1").text(txtResposta1);
		$("#lblAnwser2").text(txtResposta2);
		$("#lblAnwser3").text(txtResposta3);
	} catch (e) {
		estilo = "conteudo"
	}
	$("#corpo").addClass(estilo);
	addCheckBox();
	addCheckBox();
	addCheckBox();
	$(document).on('click', "#btnAction", function() {
		responder()
	});
	exibirPerguntas();
	selectDiv();
});

function selectDiv() {
	if (estilo == "pergunta1" || estilo == "pergunta") {
		$("#dvpergunta").show();
		$("#dvconteudo").hide();
	} else {
		$("#dvconteudo").show();
		$("#dvpergunta").hide();
		if (estilo != "inicio") {
			initVideo();
		}
	}
}

function addCheckBox() {
	nome = "chkbox" + (checkBoxGroup.length + 1)
	checkBoxGroup.push(new CheckBox(nome));
	$(document).on('click', "#" + nome, function() {
		selectAtivo(this);
	});
}

function selectAtivo(me) {
	chkSelecionado = true;
	$("#btnAction").css("opacity", 1);
	if (respondido == false) {
		$.each(checkBoxGroup, function(index, item) {
			if (item.id == me.id) {
				item.ative(true);
			} else {
				item.ative(false);
			}
		})
	}
}

function responder() {
	if (respondido == false) {
		if (chkSelecionado) {
			respostas = parent.getRespostas(idquestao);
			$.each(checkBoxGroup, function(index, item) {
				teste = item.validar(respostas[index]);
				if(teste){
					parent.addScore();
				}
			});
			$('#btnAction').attr('src', '../shared/image/continuar.png');
			respondido = true;
		}
	} else {
		$('#btnAction').attr('src', '../shared/image/txtResponder.png');
		parent.funcaoNext();
	}
}

function exibirPerguntas() {
	var tipo = parent.getTipoSlide();
	var taxa = 0;
	var taxaButon = 0
	if (tipo == "pergunta") {
		taxa = 1;
		taxaButon =  0.5;
	}
	$.each(checkBoxGroup, function(index, item) {
		item.exibir(taxa);
	});
	$("#btnAction").css("opacity", taxaButon);

}

function initVideo() {
	parent.exibiNext(false);
	parent.exibiPrev(false);
	player = new Video("video");
	player.addSource(new SourceVideo("video/conferencia/" + estilo + ".mp4"));
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