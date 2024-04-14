<template>
  <div class="container">
    <div class="quiz-container" v-if="!allQuestionsCompleted && questions.length > 0 && currentQuestion < questions.length">

      <div class="content-area">

        <!-- Left image area -->
        <div class="image-area" v-if="!timerActive && questions[currentQuestion].src_path">
          <img :src="questions[currentQuestion].src_path" alt="City Image" />
        </div>

        <!-- Right question and choice area -->
        <div class="question-area" v-if="!timerActive">

          <div class="previous-info" v-if="isEvenQuestion">
            <p class="ai-assist-prompt">Please answer again with AI assistance.</p>
          </div>

          <div class="comparison-area" v-if="isEvenQuestion">
            <!-- User's previous choices -->
            <div class="user-previous-info">
              <p class="bold-text">Your Choice: <span>{{ choiceWithoutAI[questions[currentQuestion-1].src_path] }}</span></p>
              <div class="confidence-section">
                <p class="bold-text">Your Confidence: <span>{{ confidencesWithoutAI[questions[currentQuestion-1].src_path] || 'N/A' }}</span></p>
                <div class="confidence-indicator">
                  <div class="indicator">
                    <div :style="{ left: previousConfidence + '%' }" class="pointer"></div>
                    <div class="fill"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI decision, accuracy and confidence index area -->
            <div class="ai-info">
              <p class="bold-text">AI Decision: <span>{{ aiDecision }}</span></p>
              <div class="confidence-section">
                <p class="bold-text"> AI Confidence: <span>{{ confidence }}%</span></p>
                <div class="confidence-indicator">
                  <div class="indicator">
                    <div :style="{ left: confidence + '%' }" class="pointer"></div>
                    <div class="fill"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p>
            <span class="bold-text">
              {{ isEvenQuestion ? 'Please confirm your final choice.' : 'Which city\'s landscape is shown in this picture?' }}
            </span>
          </p>


          <el-button @mouseover="hover=true" @mouseleave="hover=false"
                     :class="{ highlighted: hover || optionSelected === questions[currentQuestion].first_option }"
                     @click="updateOption(questions[currentQuestion].first_option)">{{ questions[currentQuestion].first_option }}</el-button>
          <el-button @mouseover="hover=true" @mouseleave="hover=false"
                     :class="{ highlighted: hover || optionSelected === questions[currentQuestion].second_option }"
                     @click="updateOption(questions[currentQuestion].second_option)">{{ questions[currentQuestion].second_option }}</el-button>
          <el-button @mouseover="hover=true" @mouseleave="hover=false"
                     :class="{ highlighted: hover || optionSelected === questions[currentQuestion].third_option }"
                     @click="updateOption(questions[currentQuestion].third_option)">{{ questions[currentQuestion].third_option }}</el-button>

          <div class="ai-info" v-if="optionSelected">
<!--            <p style="font-weight: bold; font-size: 25px; margin-top: 20px;">-->
<!--              <template v-if="isEvenQuestion">-->
<!--                Please confirm your final confidence for this question.-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                Use the slider to rate your confidence on this question.-->
<!--              </template>-->
<!--            </p>-->
<!--            <VueSlider v-model="confidenceValue" :min="0" :max="100" :tooltip="'always'" :height="10" style="width: 60%; margin-top: 20px;"></VueSlider>-->
            <el-button @click="confirmSelection" style="margin-top: 30px;">{{ isModifiedEvenQuestion ? 'Submit' : 'Next' }}</el-button>
          </div>

        </div>

      </div>

      <!-- Progress bar -->
      <div class="progress-bar" v-if="!timerActive">
        <el-progress type="line" :percentage="(Math.floor(currentQuestion / 2) / ((questions.length - 1)/2)) * 100" :show-text="false"></el-progress>
        <div class="progress-text">
          Progress: {{ Math.floor(currentQuestion / 2) + '/' + (questions.length - 1)/2}}
        </div>
      </div>

    </div>

    <!-- Completion message -->
    <div v-else class="completion-message">
      <p class="completion-text">Well done! You have completed all the questions.</p>
<!--      <p class="large-text">AI accuracy is: <span class="time-format">70%</span></p>-->
<!--      <p class="large-text">Your first choice (without AI-assist) accuracy is: <span class="time-format">{{ firstAttemptAccuracy.toFixed(2) }}%</span></p>-->
<!--      <p class="large-text">Your final choice (with AI-assist) accuracy is: <span class="time-format">{{ userAccuracy.toFixed(2) }}%</span></p>-->
<!--      <p class="large-text">{{ completionMessage.message }}<span class="time-format">{{ elapsedTime }}</span>. {{ completionMessage.bonusMessage }}</p>-->

<!--      <div>-->
<!--        <input style=" margin-right: 10px; margin-top: 20px;" type="checkbox" id="confirmCheckbox" v-model="isConfirmed">-->
<!--        <label for="confirmCheckbox" class="large-text">Please confirm that you have read and understood the contents of this page.</label>-->
<!--      </div>-->

      <el-button style="margin-top: 30px;" @click="goToMenu">
        Back to Survey
      </el-button>
    </div>

  </div>
</template>

<script>
import { Button, Progress, Message } from 'element-ui';
import * as d3 from 'd3';
import axios from 'axios';
// import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default {
  components: {
    'el-button': Button,
    'el-progress': Progress,
    // 'VueSlider': VueSlider,
  },

  data() {
    return {
      hover: false,
      optionSelected: '',
      aiDecision: '',
      accuracy: 0,
      confidence: 0,
      currentQuestion: 0,
      questions: [],
      countdown: 0.1,
      timerActive: false,
      correctAnswers: 0,
      isCurrentAnswerCorrect: false,
      initialOptionsSelected: [],

      totalTime: 1800,
      minutesLeft: null,
      secondsLeft: null,

      confidenceValue: 0,

      choiceWithoutAI: {},
      choiceWithAI: {},
      confidencesWithoutAI: {},
      confidencesWithAI: {},

      startTime: null,
      elapsedTime: null,
      redirectCountdown: 0,

      completionMessageData: {
        message: '',
        bonusMessage: ''
      },

      buttonCountdown: 10,
      buttonCountdownInterval: null,
      buttonDisabled: true,
      isConfirmed: false,
      manualLabel: 'lower',
    }
  },

  created() {
    if (localStorage.getItem('currentQuestion')) {
      this.currentQuestion = Number(localStorage.getItem('currentQuestion'));
      this.optionSelected = localStorage.getItem('unconfirmedAnswer');
    }

    if (localStorage.getItem('correctAnswers')) {
      this.correctAnswers = Number(localStorage.getItem('correctAnswers'));
    }

    const unconfirmedAnswer = localStorage.getItem('unconfirmedAnswer');
    if (unconfirmedAnswer) {
      this.optionSelected = unconfirmedAnswer;
      this.confirmSelection();
    }

    d3.csv('/database/calibration_database_10_lower.csv').then(data => {
      this.questions = data;
      this.initialOptionsSelected = Array(this.questions.length-1).fill(null);  // 初始化 initialOptionsSelected
      if(this.questions.length > 0) this.updateQuestion();
    }).catch(error => {
      console.error("An error occurred while loading the CSV file", error);
    });

    this.choiceWithoutAI = JSON.parse(localStorage.getItem('choiceWithoutAI')) || {};
    this.choiceWithAI = JSON.parse(localStorage.getItem('choiceWithAI')) || {};
    this.confidencesWithoutAI = JSON.parse(localStorage.getItem('confidencesWithoutAI')) || {};
    this.confidencesWithAI = JSON.parse(localStorage.getItem('confidencesWithAI')) || {};

    this.startQuizTimer();
    this.startTime = Date.now();
  },

  watch: {
    currentQuestion(newVal) {
      localStorage.setItem('currentQuestion', newVal);
    },
    correctAnswers(newVal) {
      localStorage.setItem('correctAnswers', newVal);
    },
    allQuestionsCompleted(newVal) {
      if (newVal) {
        this.setCompletionMessage();
        this.startButtonCountdown();
      }
    },
  },

  computed: {
    allQuestionsCompleted() {
      return this.currentQuestion >= (this.questions.length - 1);
    },

    userAccuracy() {
      let correctAIAssistedAttempts = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if (i % 2 !== 0) { // This means isEvenQuestion
          let userChoice = this.choiceWithAI[this.questions[i].src_path];
          if (userChoice === this.questions[i].correct_label) {
            correctAIAssistedAttempts++;
          }
        }
      }
      return ((correctAIAssistedAttempts / (10)) * 100) || 0;
    },

    // Compute first attempt accuracy
    firstAttemptAccuracy() {
      let correctFirstAttempts = 0;
      for (let i = 0; i < this.questions.length; i++) {
        if (i % 2 === 0) { // This means !isEvenQuestion
          let userChoice = this.choiceWithoutAI[this.questions[i].src_path];
          if (userChoice === this.questions[i].correct_label) {
            correctFirstAttempts++;
          }
        }
      }
      return ((correctFirstAttempts / (10)) * 100) || 0;
    },

    isEvenQuestion() {
      return this.currentQuestion % 2 !== 0;
    },

    previousConfidence() {
      const confidenceString = this.confidencesWithoutAI[this.questions[this.currentQuestion - 1].src_path];
      return confidenceString ? parseInt(confidenceString) : 0;
    },

    completionMessage() {
      return this.completionMessageData;
    },
  },

  methods: {
    updateOption(option) {

      // if(this.currentQuestion % 2 === 0) {
      //   this.$set(this.choiceWithoutAI, this.questions[this.currentQuestion].src_path, option);
      //   localStorage.setItem('choiceWithoutAI', JSON.stringify(this.choiceWithoutAI));
      // } else {
      //   this.$set(this.choiceWithAI, this.questions[this.currentQuestion].src_path, option);
      //   localStorage.setItem('choiceWithAI', JSON.stringify(this.choiceWithAI));
      // }

      this.optionSelected = option;
      localStorage.setItem('unconfirmedAnswer', option);
    },

    showMessage(type, msg) {
      Message({
        message: msg,
        type: type
      });
    },

    confirmSelection() {
      // if (this.confidenceValue <= 0) {
      //   this.showMessage('warning', 'You must slide the slider to rate your confidence on this question.');
      //   return;
      // }

      if (!this.isEvenQuestion) {
        // Odd question, record user choice and confidence
        this.$set(this.choiceWithoutAI, this.questions[this.currentQuestion].src_path, this.optionSelected);
        localStorage.setItem('choiceWithoutAI', JSON.stringify(this.choiceWithoutAI));

        this.$set(this.confidencesWithoutAI, this.questions[this.currentQuestion].src_path, `${this.confidenceValue}%`);
        localStorage.setItem('confidencesWithoutAI', JSON.stringify(this.confidencesWithoutAI));
        console.log(this.confidencesWithoutAI);

        this.confidenceValue = 0;
        this.nextQuestion();
      } else {
        // Even question, check if the selected option is correct
        if (this.optionSelected === this.questions[this.currentQuestion].correct_label) {
          this.isCurrentAnswerCorrect = true;
          this.timerActive = true;
          this.startCountdown();
        } else {
          this.isCurrentAnswerCorrect = false;
          this.timerActive = true;
          this.startCountdown();
        }

        if (this.optionSelected === this.questions[this.currentQuestion].correct_label) {
          this.correctAnswers++;
        }

        this.$set(this.choiceWithAI, this.questions[this.currentQuestion].src_path, this.optionSelected);
        localStorage.setItem('choiceWithAI', JSON.stringify(this.choiceWithAI));

        this.$set(this.confidencesWithAI, this.questions[this.currentQuestion].src_path, `${this.confidenceValue}%`);
        localStorage.setItem('confidencesWithAI', JSON.stringify(this.confidencesWithAI));
        console.log(this.confidencesWithAI);
      }
    },

    nextQuestion() {
      this.currentQuestion++;

      this.optionSelected = '';
      this.hover = false;
      this.confidenceValue = 0;

      this.timerActive = false;

      if(this.currentQuestion < this.questions.length){
        this.updateQuestion();
      } else {
        clearInterval(this.timer);
        localStorage.removeItem('correctAnswers');
      }
    },

    updateQuestion() {
      if (this.currentQuestion < this.questions.length) {
        const question = this.questions[this.currentQuestion];

        let options = [question.correct_label, question.incorrect_label_1, question.incorrect_label_2]; // Update the options array

        for (let i = options.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        this.aiDecision = question.ai_decision;
        this.accuracy = question.ai_accuracy;
        this.confidence = question.ai_confidence;

        this.questions[this.currentQuestion].first_option = options[0];
        this.questions[this.currentQuestion].second_option = options[1];
        this.questions[this.currentQuestion].third_option = options[2]; // Add the third option
      }
    },

    startCountdown() {
      this.timer = setInterval(() => {
        if (this.countdown <= 0) {
          clearInterval(this.timer);
          this.nextQuestion();
        } else {
          this.countdown -= 0.01;
        }
      }, 100);
    },

    startQuizTimer() {
      this.timer = setInterval(() => {
        if (this.totalTime <= 0) {
          clearInterval(this.timer);
          window.location.href = "https://app.prolific.com/submissions/complete?cc=C1IL9SDR";
        } else {
          this.totalTime--;
          this.minutesLeft = Math.floor(this.totalTime / 60);
          this.secondsLeft = this.totalTime % 60;

          // Show a message when there are 15 minutes left
          if (this.totalTime === 900) {
            this.showMessage('warning', 'You have 15 minutes remaining.');
          }
        }
      }, 1000);
    },

    beforeDestroy() {
      clearInterval(this.timer);
      clearInterval(this.countdownTimer);
      if (this.buttonCountdownInterval) {
        clearInterval(this.buttonCountdownInterval);
      }
    },

    calculateElapsedTime() {
      const endTime = Date.now();
      const elapsedTime = endTime - this.startTime;
      const minutes = Math.floor(elapsedTime / 60000);
      const seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return minutes + "min " + (seconds < 10 ? '0' : '') + seconds + "s";
    },

    setCompletionMessage() {
      // Call the method to update the elapsed time
      this.elapsedTime = this.calculateElapsedTime();

      // Convert elapsedTime to seconds for comparison
      const elapsedSeconds = this.convertToSeconds(this.elapsedTime);

      const finalAccuracy = parseFloat(this.userAccuracy.toFixed(2));
      this.completionMessageData.message = `Your total quiz duration was: `;

      this.completionMessageData.bonusMessage = elapsedSeconds < 300 && finalAccuracy > 70 ?
          "Congratulations, you have received a bonus." :
          "Unfortunately, you did not receive a bonus.";
    },

    convertToSeconds(timeString) {
      const [min, sec] = timeString.split(/min |s/).map(Number);
      return min * 60 + sec;
    },

    checkBonusReceived() {
      return this.userAccuracy > 70 && this.convertToSeconds(this.elapsedTime) < 780;
    },

    startButtonCountdown() {
      this.buttonCountdownInterval = setInterval(() => {
        if (this.buttonCountdown > 0) {
          this.buttonCountdown--;
        } else {
          this.buttonDisabled = false;
          clearInterval(this.buttonCountdownInterval);
          this.buttonCountdownInterval = null;
        }
      }, 1000);
    },

    startRedirectCountdown() {
      let countdownInterval = setInterval(() => {
        if (this.redirectCountdown <= 0) {
          clearInterval(countdownInterval);
          this.goToMenu();
        } else {
          this.redirectCountdown--;
        }
      }, 1000);
    },

    goToMenu() {
      // Check if the button is disabled

      localStorage.setItem('currentQuestion', 0);
      localStorage.setItem('correctAnswers', 0);

      this.confidencesWithAI['manualLabel'] = this.manualLabel;

      const PROLIFIC_PID = localStorage.getItem('userId') || 'defaultUserId';
      const qualtricsUrl = `https://nus.syd1.qualtrics.com/jfe/form/SV_5j3XsOn4oKS6OcS/?PROLIFIC_PID=${PROLIFIC_PID}`;


      axios.post('https://ai-calibration-backend-da61b7d9f154.herokuapp.com/api/calibration_10_NoF', {
        // axios.post('http://localhost:3001/api/calibration', {
        userId: localStorage.getItem('userId'),
        firstAccuracy: this.firstAttemptAccuracy.toFixed(2),
        finalAccuracy: this.userAccuracy.toFixed(2),
        choiceWithoutAI: this.choiceWithoutAI,
        choiceWithAI: this.choiceWithAI,
        confidencesWithoutAI: this.confidencesWithoutAI,
        confidencesWithAI: this.confidencesWithAI,
        elapsedTime: this.convertToSeconds(this.elapsedTime),
        bonusReceived: this.checkBonusReceived()
      }).then(results => {
        console.log('All requests finished', results);
        window.location.href = qualtricsUrl;
        localStorage.clear();
        // this.$router.push('/');
      }).catch(error => {
        console.error(error);
      });
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80vh;
  flex-direction: row;

  margin-left: auto;
  margin-right: auto;
}

.quiz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex-direction: column;

  margin-left: auto;
  margin-right: auto;
}

.content-area {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  height: 80vh;
}

.image-area {
  flex: 1;
  max-width: 45%;
  margin-right: 10px;
}

.image-area img {
  max-width: 100%;
  max-height: 600px;
  width: auto;
  height: auto;
}

.question-area {
  flex: 2;
  max-width: 55%;
  margin-left: 10px;
}

.el-button {
  margin: 10px;
  width: 160px;
  background-color: #00AC6A;
  border: none;
  color: white;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
  padding: 10px 24px;
  text-decoration: none;
}

.el-button:hover {
  background-color: #6CCF70;
}

.highlighted {
  background-color: #156AA8;
  color: white;
}

.previous-info p span {
  color: red;
  background-color: rgba(255, 255, 0, 0.6);
}

.question-area p{
  font-size: 30px;
}

.user-accuracy p{
  font-size: 16px;
}

.ai-info p {
  font-size: 16px;
}

.bold-text {
  font-weight: bold;
}

.ai-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 5px;
}

.ai-info p.bold-text {
  font-weight: bold;
  color: black;
  font-size: 15px;
}

.ai-info p.bold-text span {
  color: #008B8B;
}

.ai-info .sub {
  margin-top: 40px;
  width: 100px;
  background-color: #00AC6A;
  border: none;
  color: white;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
  padding: 10px 24px;
  text-decoration: none;
}

.confidence-section {
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
}

.confidence-text {
  margin-right: 10px;
}

.confidence-indicator {
  flex-basis: 50%;
  display: flex;
  align-items: center;
  position: relative;
  height: 20px;
  margin-left: 10px;
}

.indicator {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, lightblue, blue);
}

.pointer {
  position: absolute;
  width: 3px;
  height: 120%;
  bottom: -10%;
  background-color: white;
}

.pointer::after {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid red;
}

.countdown {
  color: red;
  font-size: 20px;
  margin-top: 10px;
}

.countdown .correct-answer {
  color: green;
  font-size: 30px;
  font-weight: bold;
}

.countdown .incorrect-answer {
  color: red;
  font-size: 30px;
  font-weight: bold;
}

.user-accuracy {
  font-size: 18px;
  margin-top: 20px;
}

.bold-text {
  font-weight: bold;
}

.completion-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.completion-text {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

body .el-slider__runway {
  background: linear-gradient(to right, lightblue, blue) !important;
}

body .el-slider__bar {
  background-color: transparent !important;
}

.progress-text {
  font-size: 20px;
}

.ai-assist-prompt {
  font-weight: bold;
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.comparison-area {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.comparison-area {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.user-previous-info,
.ai-info {
  flex: 1;
  padding: 0 10px;
}

.user-previous-info .bold-text,
.ai-info .bold-text {
  font-weight: bold;
  color: black;
  font-size: 15px;
}

.user-previous-info .bold-text span {
  color: #777777;
}

.time-format {
  color: #008B8B;
  background-color: #F0FFF0;
  padding: 2px 4px;
  border-radius: 4px;
}

.large-text {
  font-size: 1.25em;
}

</style>