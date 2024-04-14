<template>
  <div v-if="stage !== 5" class="menu-container">
    <h1>Welcome to Online City Landscape Image Annotation Tasks</h1>
    <el-button class="pilot-button" @click="promptForUserId('calibration_10_Before')">Start</el-button>
<!--    <el-button class="pilot-button" @click="promptForUserId('calibration_10_Without_NoF')">Start</el-button>-->
  </div>

  <div v-else class="else-container">
    <h1>Well done! You have completed all task.</h1>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui';

export default {
  data() {
    return {
      stage: Number(localStorage.getItem('stage')) || 0,
      prolificId: null
    }
  },
  mounted() {
    this.prolificId = this.getURLParameter('PROLIFIC_PID');

    if(this.stage === 5){
      setTimeout(() => {
        this.clearLocalStorage();
        location.reload();
      }, 2000);
    }
  },
  methods: {
    getURLParameter(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]*)').exec(location.search)||["",""])[1].replace(/\+/g, '%20'))||null;
    },
    promptForUserId(destination) {
      // Check if userId exists in localStorage
      var initialUserId = this.prolificId || localStorage.getItem('userId');

      if(initialUserId) {
        this.confirmUserId(initialUserId, destination);
      } else {
        this.confirmUserId("", destination);
      }
    },
    confirmUserId(initialId, destination) {
      MessageBox.prompt('Please confirm your user ID', 'Notice', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputValue: initialId
      }).then(({ value }) => {
        localStorage.setItem('userId', value);
        this.navigateToDestination(destination);
      }).catch(() => {});
    },
    navigateToDestination(destination) {
      if (destination === "calibration_10_Before") {
        this.goToCalibration2();
      } else if (destination === "calibration_10_Without_NoF") {
        this.goToCalibration5();
      }
    },
    goToCalibration2() {
      this.$router.push('/CityImageCalibration2');
    },
    goToCalibration5() {
      this.$router.push('/CityImageCalibration5');
    },
  }
};
</script>

<style scoped>
.else-container{
  margin-top: 20%;
  align-items: center;
}

.menu-container {
  display: flex;
  margin-top: 5%;
  align-items: center;
  justify-content: center; /* Add this line */
  height: 100%;
  flex-direction: column;
}

.el-button {
  margin: 10px;
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
  width: 300px;
}

.pilot-button {
  margin-top: 250px;
}

</style>
