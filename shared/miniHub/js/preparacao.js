var checkBoxGroup = [];
var respondido = false;
var complemeto = "";
var chkSelecionado = false;
var idquestao = 0;
var txtPergunta = "";
var txtResposta1 = "";
var txtResposta2 = "";
var txtResposta3 = "";
var estilo = "";

$(function() {
	try {
		parent.testeButon();
		estilo = parent.getEstilo()
		if (estilo == "conteudo" || estilo == "conteudo1" || estilo == "inicio"
				|| estilo == "prefacio") {
			parent.exibiPrev(false);
			var txtPergunta = "";
			var txtResposta1 = "";
			var txtResposta2 = "";
			var txtResposta3 = "";
		}
		if (estilo == "pergunta") {
			txtPergunta = "De acordo com o que você soube em ";
			txtPergunta += "treinamento, qual tela o colaborador Via Varejo deverá fechar a ";
			txtPergunta += "carga mini hub (cargao) para gerar a carga de nota (carguinhas)?";
			var txtResposta1 = "S8CW";
			var txtResposta2 = "S6BR";
			var txtResposta3 = "S8KC";

		}
		if (estilo == "pergunta1") {
			idquestao = 1;
			txtPergunta = "Quais são os primeiros passos a serem seguidos para iniciar o picking (separação)?";
			var txtResposta1 = "O colaborador deverá bipar o código de barras na folha de separação e o EAN da mercadoria ";
			var txtResposta2 = "O colaborador deverá imprimir a folha de separação e seguir o procedimento como descrito";
			var txtResposta3 = "O colaborador deverá imprimir a folha de separação e seguir o procedimento como descrito";
		}
		$("#dvtxtPergunta").text(txtPergunta);
		$("#lblAnwser1").text(txtResposta1);
		$("#lblAnwser2").text(txtResposta2);
		$("#lblAnwser3").text(txtResposta3);
	} catch (e) {
		estilo = "conteudo"
		var txtPergunta = "";
		var txtResposta1 = "";
		var txtResposta2 = "";
		var txtResposta3 = "";
	}
	$("#corpo").addClass(estilo);
	addCheckBox();
	addCheckBox();
	addCheckBox();
	$(document).on('click', "#btnAction", function() {
		responder()
	});
	exibirPerguntas()
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
				if (teste) {
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
	try {
		var tipo = parent.getTipoSlide();	
	} catch (e) {
		var tipo = "conteudo";
	}
	var taxa = 0;
	var taxaButon = 0
	if (tipo == "pergunta") {
		taxa = 1;
		taxaButon = 0.5;
	}
	$.each(checkBoxGroup, function(index, item) {
		item.exibir(taxa);
	});
	$("#btnAction").css("opacity", taxaButon);

}

function initVideo() {
	try {
		parent.exibiNext(false);
		parent.exibiPrev(false);	
	} catch (e) {
		// TODO: handle exception
	}
	player = new Video("video");
	player.addSource(new SourceVideo("video/preparacao/" + estilo + ".mp4"));
	player.intiVideo();
}

function acopanhaVideo(currentTime, duration) {
	player.onTrackedVideoFrame(currentTime, duration);
	$('#duracao').val(duration);
	$('#time').val(currentTime);
}
function encerraVideo() {
	try {
		parent.exibiNext(true);
		if (estilo == "conteudo" || estilo == "prefacio") {
			parent.exibiPrev(true);
		}
	} catch (e) {
		// TODO: handle exception
	}
	
}
