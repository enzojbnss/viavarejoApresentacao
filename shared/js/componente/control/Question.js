/**
 * 
 */
var Question = function(id, text, type, answers, correctAnswer, objectiveId) {
	this.id = id;
	this.text = text;
	this.type = type;
	this.answers = answers;
	this.correctAnswer = correctAnswer;
	this.objectiveId = objectiveId;
	
	this.getAnswers = function(){
		return this.answers;
	}
	
};