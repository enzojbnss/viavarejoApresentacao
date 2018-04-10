var conteudo = "";
var navegador = "";
var tela = "";
var scorm = "";
var apresentacao = "";
var test = "";
var scormIsFinalized = false;
var scormIsRegistred = false;
var aluno = "";
var indice = 0;

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
	tela = new Tela("contentFrame");
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
	conteudo.addPage("miniHub/projetor.html");
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
		'' // TODO: handle exception
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
	indice++;
	/*
	 * if (initModulo) { conteudo.nextPage(); setApresentacao(); if
	 * (apresentacao.count() > 1) { initModulo = false; } try { teste =
	 * conteudo.isUltimaPagina(); verificaStatus(); var bookmark =
	 * getBookmark(); scorm.processSetValue("cmi.core.lesson_location",
	 * bookmark); if (teste == true) { setScore();
	 * scorm.processSetValue("cmi.core.lesson_status", "completed"); }
	 * testeButons(); } catch (e) { // TODO: handle exception }
	 * tela.setSRC(conteudo.getUrlAtual()); } else { apresentacao.next(); if
	 * (apresentacao.isLast()) { initModulo = true; } else { initModulo = false; }
	 * tela.setSRC(conteudo.getUrlAtual()); }
	 */
};

function funcaoPrev() {
	indice--;
	// apresentacao.prev();
	// tela.setSRC(conteudo.getUrlAtual());
};

function exibiPrev(value) {
	navegador.ativaBtnPrev(value);
}

function exibiNext(value) {
	navegador.ativaBtnNext(value);
}

function testeButon() {
	if (indice < 0) {
		exibiPrev(false);
	} else if (indice == 8) {
		exibiNext(false);
	}
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
		score = parseInt(aluno.getScore())
		if (isNaN(score)) {
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
