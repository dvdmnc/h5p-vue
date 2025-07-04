// H5P MultiChoice implementation that extends H5P.Question
H5P = H5P || {};

H5P.MultiChoice = (function ($) {
  'use strict';

  function MultiChoice(params, id, extras) {
    // Call parent constructor with correct parameters for H5P.Question
    H5P.Question.call(this, 'multichoice', { 
      theme: { name: 'default' }
    });
    
    this.params = params || {};
    this.id = id;
    this.score = 0;
    this.maxScore = 1;
    this.contentId = id;
    this.contentData = extras || {};
    this.answered = false;
    
    console.log('🔧 H5P.MultiChoice constructor called with params:', params);
    console.log('🔧 H5P.MultiChoice ID:', id);
  }

  // Inherit from H5P.Question
  MultiChoice.prototype = Object.create(H5P.Question.prototype);
  MultiChoice.prototype.constructor = MultiChoice;

  // Register DOM elements (called by H5P.Question.attach)
  MultiChoice.prototype.registerDomElements = function () {
    const self = this;
    
    console.log('🔧 H5P.MultiChoice.registerDomElements() called');
    console.log('🔧 Parameters:', this.params);
    
    // Create main container
    const $container = $('<div class="h5p-multichoice">');
    
    // Add question text
    if (this.params.question) {
      $container.append(`<div class="h5p-question-text">${this.params.question}</div>`);
    }
    
    // Create answers container
    const $answersContainer = $('<ul class="h5p-answers">');
    
    // Add answers
    if (this.params.answers && this.params.answers.length > 0) {
      this.params.answers.forEach((answer, index) => {
        const $answerItem = $(`
          <li class="h5p-answer" data-index="${index}">
            <div class="h5p-alternative-container">
              <input type="radio" id="h5p-answer-${this.id}-${index}" name="answer-${this.id}" value="${index}">
              <label for="h5p-answer-${this.id}-${index}" class="h5p-answer-text">
                ${answer.text || answer || 'Option ' + (index + 1)}
              </label>
            </div>
          </li>
        `);
        $answersContainer.append($answerItem);
      });
    } else {
      // Add default demo answers if none provided
      const demoAnswers = [
        { text: 'Framework progressif et facile à apprendre', correct: true },
        { text: 'Complexité élevée', correct: false },
        { text: 'Pas de documentation', correct: false }
      ];
      
      demoAnswers.forEach((answer, index) => {
        const $answerItem = $(`
          <li class="h5p-answer" data-index="${index}">
            <div class="h5p-alternative-container">
              <input type="radio" id="h5p-answer-${this.id}-${index}" name="answer-${this.id}" value="${index}">
              <label for="h5p-answer-${this.id}-${index}" class="h5p-answer-text">
                ${answer.text}
              </label>
            </div>
          </li>
        `);
        $answersContainer.append($answerItem);
      });
      
      // Update params with demo data
      this.params.answers = demoAnswers;
      this.params.question = this.params.question || 'Quel est le principal avantage de Vue.js ?';
    }
    
    $container.append($answersContainer);
    
    // Add feedback area
    const $feedback = $('<div class="h5p-feedback" style="margin-top: 1rem; display: none;">');
    $container.append($feedback);
    
    // Register content with Question base class
    this.setContent($container);
    
    // Register check button
    this.addButton('check-answer', this.params.UI?.checkAnswerButton || 'Vérifier', function () {
      self.checkAnswer();
    });
    
    console.log('✅ H5P.MultiChoice DOM elements registered successfully');
  };

  MultiChoice.prototype.attach = function ($container) {
    // Delegate to parent Question.attach which will call registerDomElements
    H5P.Question.prototype.attach.call(this, $container);
    
    // Add any MultiChoice-specific event listeners after parent attach
    const self = this;
    setTimeout(() => {
      $container.find('.h5p-answer').on('mouseenter', function() {
        $(this).css('background-color', '#f8f9fa');
      }).on('mouseleave', function() {
        $(this).css('background-color', '');
      });
    }, 100);
    
    console.log('✅ H5P.MultiChoice attached to container successfully');
  };

  MultiChoice.prototype.checkAnswer = function() {
    const selectedAnswer = this.$content.find(`input[name="answer-${this.id}"]:checked`);
    if (selectedAnswer.length === 0) {
      alert('Veuillez sélectionner une réponse');
      return;
    }
    
    const selectedIndex = parseInt(selectedAnswer.val());
    const isCorrect = this.params.answers[selectedIndex]?.correct || false;
    
    this.score = isCorrect ? 1 : 0;
    this.answered = true;
    
    // Show feedback
    const feedbackDiv = this.$content.find('.h5p-feedback');
    if (feedbackDiv.length > 0) {
      const feedback = isCorrect ? 
        (this.params.answers[selectedIndex]?.tipsAndFeedback?.chosenFeedback || 'Correct !') :
        (this.params.answers[selectedIndex]?.tipsAndFeedback?.chosenFeedback || 'Incorrect.');
        
      feedbackDiv.html(`
        <div style="padding: 0.75rem; border-radius: 0.375rem; ${isCorrect ? 'background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724;' : 'background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'}">
          ${feedback}
        </div>
      `);
      feedbackDiv.show();
    }
    
    // Update visual feedback on answers
    this.$content.find('.h5p-answer').each(function(index) {
      const $this = $(this);
      const answer = this.params.answers[index];
      if (answer?.correct) {
        $this.addClass('h5p-correct');
      } else if (index === selectedIndex && !isCorrect) {
        $this.addClass('h5p-wrong');
      }
    }.bind(this));
    
    this.trigger('scored', this.score, this.maxScore);
    console.log('H5P.MultiChoice answer checked, score:', this.score, 'isCorrect:', isCorrect);
  };

  MultiChoice.prototype.getScore = function() {
    return this.score;
  };

  MultiChoice.prototype.getMaxScore = function() {
    return this.maxScore;
  };
  
  MultiChoice.prototype.getAnswerGiven = function() {
    return this.answered;
  };
  
  MultiChoice.prototype.showSolutions = function() {
    // Implementation for showing solutions
    console.log('H5P.MultiChoice showSolutions called');
  };
  
  MultiChoice.prototype.resetTask = function() {
    this.score = 0;
    this.answered = false;
    // Reset UI if needed
    console.log('H5P.MultiChoice resetTask called');
  };

  return MultiChoice;
})(H5P.jQuery || jQuery);
