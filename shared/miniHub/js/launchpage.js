var conteudo = "";
var navegador = "";
var tela = "";
var scorm = "";
var apresentacao = "";
var test = "";
var scormIsFinalized = false;
var scormIsRegistred = false;
var apresentacaoCount = 0;
var initModulo = false;
var QUESTION_TYPE_CHOICE = "choice";
var QUESTION_TYPE_TF = "true-false";
var QUESTION_TYPE_NUMERIC = "numeric";
var questaoAtual = 0;
var aluno="";

var estilo = "teste";
SetupIFrame("contentFrame");

$(function() {
	init();
});

$(window).on('beforeunload', doUnload(false));

$(window).on('unload', doUnload());

function init() {
	setContent();
	navegador = new Navegador();
	navegador.setValorInativo(0, 0);
	initPreparacao()
	tela = new Tela("contentFrame");
	test = new Test();
	carregarTeste();
	var url = conteudo.getUrlAtual();
	try {
		tela.setSRC(url);
		scorm = new Scorm();
		scorm.setStartTime(new Date());
		scorm.processInitialize(getAPI());
		verificaStatus();
		var bookmark = getBookmark();
		bookmark = testaBookmark(bookmark);
		idAluno = scorm.processGetValue("cmi.core.student_id");
		nomeAluno = scorm.processGetValue("cmi.core.student_name");
		scoreAluno = getScore();
		aluno = new Aluno(idAluno, nomeAluno, scoreAluno);
		scorm.processSetValue("cmi.core.lesson_location", bookmark);
	} catch (e) {
		aluno = new Aluno(1, "teste", 0);
		alert(e);
	}
}

function setContent() {
	conteudo = new Content();
	conteudo.addModulo("miniHub");
	conteudo.addPage("miniHub/preparacao.html");
	conteudo.addPage("miniHub/conferencia.html");
	conteudo.addPage("miniHub/embalagem.html");
	conteudo.addPage("miniHub/expedicao.html");
	conteudo.addPage("miniHub/entrega.html");
	conteudo.addPage("miniHub/retorno.html");
}

function doUnload(pressedExit) {
	try {
		if (processedUnload == true) {
			return;
		}
		processedUnload = true;
		var endTimeStamp = new Date();
		var totalMilliseconds = (endTimeStamp.getTime() - startTimeStamp
				.getTime());
		var scormTime = ConvertMilliSecondsToSCORMTime(totalMilliseconds, false);
		scorm.setStartTime = (scormTime);
		scorm.processSetValue("cmi.core.session_time", scormTime);
		if (pressedExit == false && reachedEnd == false) {
			scorm.processSetValue("cmi.core.exit", "suspend");
		}
		scorm.processFinish();
	} catch (e) {
		// TODO: handle exception
	}
}

function doExit() {
	try {
		if (reachedEnd == false
				&& confirm("Would you like to save your progress  to resume later?")) {
			scorm.processSetValue("cmi.core.exit", "suspend");
		} else {
			scorm.processSetValue("cmi.core.exit", "");
		}
		doUnload(true);
	} catch (e) {
		// TODO: handle exception
	}
}

function funcaoNext() {
	if (initModulo) {
		conteudo.nextPage();
		setApresentacao();
		if (apresentacao.count() > 1) {
			initModulo = false;
		}
		try {
			teste = conteudo.isUltimaPagina();
			verificaStatus();
			var bookmark = getBookmark();
			scorm.processSetValue("cmi.core.lesson_location", bookmark);
			if (teste == true) {
				setScore();
				scorm.processSetValue("cmi.core.lesson_status", "completed");
			}
			testeButons();
		} catch (e) {
			// TODO: handle exception
		}
		tela.setSRC(conteudo.getUrlAtual());
	} else {
		apresentacao.next();
		if (apresentacao.isLast()) {
			initModulo = true;
		} else {
			initModulo = false;
		}
		tela.setSRC(conteudo.getUrlAtual());
	}
};

function funcaoPrev() {
	apresentacao.prev();
	tela.setSRC(conteudo.getUrlAtual());
};

function exibiPrev(value) {
	navegador.ativaBtnPrev(value);
}

function exibiNext(value) {
	navegador.ativaBtnNext(value);
}

function testeButon() {
	var tipo = apresentacao.getTipoAtual();
	if (tipo == "pergunta") {
		exibiPrev(false);
		exibiNext(false);
	} else {
		exibiNext(true);
		if (apresentacao.isFirst() == true || apresentacao.isLast()) {
			exibiPrev(false);
		} else {
			exibiPrev(true);
		}
	}
}

function getEstilo() {
	return apresentacao.getSlideAtual();
}

function getTipoSlide() {
	return apresentacao.getTipoAtual();
}

function initPreparacao() {
	var preparacao = new Apresentacao();
	preparacao.add("inicio", "conteudo");
	preparacao.add("prefacio", "conteudo");
	preparacao.add("conteudo", "conteudo");
	preparacao.add("pergunta", "pergunta");
	preparacao.add("conteudo1", "conteudo");
	preparacao.add("pergunta1", "pergunta");
	apresentacao = preparacao;
	apresentacaoCount++;
}

function initConfereicia() {
	var conferencia = new Apresentacao();
	conferencia.add("conteudo", "conteudo");
	conferencia.add("pergunta", "pergunta");
	apresentacao = conferencia;
}

function initEmbalagem() {
	var embalagem = new Apresentacao();
	embalagem.add("conteudo", "conteudo");
	apresentacao = embalagem;
}

function initEntrega() {
	var entrega = new Apresentacao();
	entrega.add("conteudo", "conteudo");
	entrega.add("conteudo1", "conteudo");
	entrega.add("pergunta", "pergunta");
	apresentacao = entrega;
}

function initExpedicao() {
	var expedicao = new Apresentacao();
	expedicao.add("conteudo", "conteudo");
	apresentacao = expedicao;
}

function initRetorno() {
	var retorno = new Apresentacao();
	retorno.add("conteudo", "conteudo");
	retorno.add("pergunta", "pergunta");
	retorno.add("fim", "conteudo");
	apresentacao = retorno;
}

function setApresentacao() {
	switch (apresentacaoCount) {
	case 1:
		initConfereicia()
		break;
	case 2:
		initEmbalagem()
		break;
	case 3:
		initExpedicao()
		break;
	case 4:
		initEntrega()
		break;
	case 5:
		initRetorno()
		break;
	default:
		break;
	}
	apresentacaoCount++;
}

function getRespostas(posicao) {
	var questao = test.getQuestion(posicao);
	return questao.getAnswers();
}

function carregarTeste() {
	test.add("br.com.scorm.yesh.minihub_1", "preparaca1", QUESTION_TYPE_CHOICE,
			new Array(false, false, true, false), 2, "obj_minihub");
	test.add("br.com.scorm.yesh.minihub_2", "preparaca2", QUESTION_TYPE_CHOICE,
			new Array(false, true, false, false), 2, "obj_minihub");
	test.add("br.com.scorm.yesh.minihub_1", "conferencia",
			QUESTION_TYPE_CHOICE, new Array(false, false, true, false), 2,
			"obj_minihub");
	test.add("br.com.scorm.yesh.minihub_2", "expedicao", QUESTION_TYPE_CHOICE,
			new Array(true, false, false, false), 2, "obj_minihub");
	test.add("br.com.scorm.yesh.minihub_2", "entrega", QUESTION_TYPE_CHOICE,
			new Array(true, false, false, false), 2, "obj_minihub");
}

function getScore() {
	var valor;
	try {
		valor = scorm.processGetValue("cmi.core.score.raw");
	} catch (e) {
		valor = 0;
	}
	return valor;
}

function addScore() {
	try {
		score =  parseInt(aluno.getScore())
		if(isNaN(score)){
			score = 0;
		}
		score = parseInt(score) + 20;
		aluno.setScore(score);
		scorm.processSetValue("cmi.core.score.raw", score);
	} catch (e) {
		// TODO: handle exception
	}

}

function setScore() {
	try {
		score = aluno.getScore();
		scorm.processSetValue("cmi.core.score.raw", score);
		scorm.processSetValue("cmi.core.score.min", "0");
		scorm.processSetValue("cmi.core.score.max", "100");
		if (score >= 0) {
			scorm.processSetValue("cmi.core.lesson_status", "passed");
		} else {
			scorm.processSetValue("cmi.core.lesson_status", "failed");
		}
	} catch (e) {
		// TODO: handle exception
	}

}
