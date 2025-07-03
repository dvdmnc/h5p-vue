// H5P MultiChoice implementation that extends H5P.Question
H5P = H5P || {};

H5P.MultiChoice = (function ($) {
  'use strict';

  function MultiChoice(params, id, extras) {
    // Call parent constructor
    H5P.Question.call(this, {
      contentId: id,
      title: 'Multiple Choice Question'
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

  MultiChoice.prototype.attach = function ($container) {
    const self = this;
    
    console.log('🔧 H5P.MultiChoice.attach() called with container:', $container);
    console.log('🔧 Container element:', $container[0]);
    
    // Clear any existing content
    $container.empty();
    
    $container.addClass('h5p-multichoice');
    
    // Create the HTML structure
    const questionHtml = `
      <div class="h5p-question">
        <div class="h5p-question-content">
          <div class="h5p-question-text">${this.params.question || 'Question de démonstration'}</div>
          <div class="h5p-answers">
            ${(this.params.answers || []).map((answer, index) => `
              <label class="h5p-answer" data-index="${index}">
                <input type="radio" name="answer-${this.id}" value="${index}">
                <span class="h5p-answer-text">${answer.text || answer || 'Option ' + (index + 1)}</span>
              </label>
            `).join('')}
          </div>
          <button class="h5p-check-answer" style="margin-top: 1rem; padding: 0.5rem 1rem; background-color: #3b82f6; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">
            ${this.params.UI?.checkAnswerButton || 'Vérifier'}
          </button>
          <div class="h5p-feedback" style="margin-top: 1rem; display: none;"></div>
        </div>
      </div>
    `;
    
    $container.html(questionHtml);
    
    // Add event listeners
    $container.find('.h5p-check-answer').on('click', function() {
      self.checkAnswer();
    });
    
    // Add hover effects to answers
    $container.find('.h5p-answer').on('mouseenter', function() {
      $(this).css('background-color', '#f8f9fa');
    }).on('mouseleave', function() {
      $(this).css('background-color', '');
    });
    
    console.log('✅ H5P.MultiChoice content attached successfully');
    console.log('✅ Question HTML created:', questionHtml.substring(0, 100) + '...');
    
    // Force visibility
    $container.show();
    $container.css({
      'display': 'block',
      'visibility': 'visible',
      'opacity': '1'
    });
  };

  MultiChoice.prototype.checkAnswer = function() {
    const selectedAnswer = document.querySelector(`input[name="answer-${this.id}"]:checked`);
    if (!selectedAnswer) {
      alert('Veuillez sélectionner une réponse');
      return;
    }
    
    const selectedIndex = parseInt(selectedAnswer.value);
    const isCorrect = this.params.answers[selectedIndex]?.correct || false;
    
    this.score = isCorrect ? 1 : 0;
    this.answered = true;
    
    // Show feedback
    const feedbackDiv = document.querySelector(`#${this.id} .h5p-feedback`);
    if (feedbackDiv) {
      const feedback = isCorrect ? 
        (this.params.answers[selectedIndex]?.tipsAndFeedback?.chosenFeedback || 'Correct !') :
        (this.params.answers[selectedIndex]?.tipsAndFeedback?.chosenFeedback || 'Incorrect.');
        
      feedbackDiv.innerHTML = `
        <div style="padding: 0.75rem; border-radius: 0.375rem; ${isCorrect ? 'background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724;' : 'background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'}">
          ${feedback}
        </div>
      `;
      feedbackDiv.style.display = 'block';
    }
    
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
