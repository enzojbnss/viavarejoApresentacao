var Video = function(id) {
	this.id = id;
	this.timeLine = new TimeLine();
	this.listners = [];
	this.sources = [];
	this.sourceAtual = 0;

	this.addSource = function(src) {
		this.sources.push(src);
	};

	this.getSourceCount = function(){
		return this.sources.length;
	};
	
	
	this.intiVideo = function(posicao) {
		var idVideo = "#" + this.id;
		var src = "";
		if (typeof posicao == "undefined" || isNaN(parseInt(posicao))) {
			src = this.sources[0].src;
			this.sourceAtual = 0;
		} else {
			src = this.sources[posicao].src;
			this.sourceAtual = posicao;
		}
		try {
			$(idVideo + ' source').attr('src', src);
			$(idVideo).load();	
		} catch (e) {
			$(idVideo + ' source').parent().attr('src', src);
			$(idVideo).parent().load();
			// TODO: handle exception
		}
		
		
	};

	this.addEventVideo = function(action) {
		this.timeLine.add(action);
	};

	this.addListener = function(controle) {
		this.listners.push(controle);
	};

	this.addActionListener = function(controle, acao, param) {
		var listners = this.listners;
		$.each(listners, function(index, listner) {
			if (listner.controle == controle) {
				this.addAcao(acao, param);
			}
		});
	};

	this.finalizaVideo = function() {
		this.timeLine.finalizaVideo(this.sources, this.sourceAtual);
	};

	this.onTrackedVideoFrame = function(currentTime, duration) {
		this.timeLine.onTrackedVideoFrame(currentTime, duration);
	};

	this.addEvento = function(action) {
		this.timeLine.add(action);
	};

	$("#" + this.id).on('ended', function() {
		try {
			if(typeof encerraVideo == "function"){
				encerraVideo();	
			}else{
				parent.encerraVideo();
			}
		} catch (e) {
			parent.encerraVideo();
		}
	});

	$("#" + this.id).on("timeupdate", function(event) {
		acopanhaVideo(this.currentTime, this.duration);
	});

};