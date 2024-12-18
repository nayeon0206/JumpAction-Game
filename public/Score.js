import { sendEvent, gameAssetsData} from './Socket.js';

class Score {
  score = 0; // 현재 점수를 추적하는 변수, 초기값은 0
  HIGH_SCORE_KEY = 'highScore'; // 로컬 스토리지에서 고득점을 저장할 때 사용할 키
  stageChange = true; // 스테이지 전환 여부를 추적하는 변수
  // stage = 0;
  


  // 생성자: ctx(캔버스 컨텍스트)와 scaleRatio(게임의 비율)를 인자로 받음
  constructor(ctx, scaleRatio) {
    this.ctx = ctx; // 캔버스의 컨텍스트를 저장
    this.canvas = ctx.canvas; // 캔버스 객체를 저장
    this.scaleRatio = scaleRatio; // 게임 화면의 스케일 비율을 저장
    this.stage = 0;
  }

  // 게임이 진행되면서 점수를 업데이트하는 메서드
  update(deltaTime) {
    this.stageChange = true; 
    const stages = gameAssetsData.stages.data
    // const scores = stages[this.stage].scorePerSecond
    // deltaTime은 프레임 간의 시간 차이, 이를 이용해 점수를 점진적으로 증가시킴
    this.score += deltaTime * 0.001 * stages[this.stage].scorePerSecond; // 점수는 deltaTime의 0.001배만큼 증가

    // 점수가 도달하고, stageChange가 true일 때 스테이지 전환 이벤트 발생
    if (Math.floor(this.score) === stages[this.stage].score && this.stageChange) {
      console.log(this.stage)
      this.stageChange = false; // 스테이지 전환은 한 번만 이루어지도록 stageChange를 false로 설정
      sendEvent(11, { currentStage: stages[this.stage].id, targetStage: stages[this.stage + 1].id}); // 스테이지 전환 이벤트를 보냄
    this.stage += 1;
    }
  }

  // 아이템 획득 시 점수 변화가 있을 경우 사용될 메서드 (현재는 점수 변화가 없지만 나중에 확장 가능)
  getItem(itemId) {
    // 아이템 획득 시 점수 변화 (현재는 0만큼 변화하도록 설정됨)
    this.score += 0;
  }

  // 점수를 초기화하는 메서드
  reset() {
    this.score = 0; // 점수를 0으로 초기화
    this.stageChange = true;
    this.stage = 0;
  }

  // 고득점을 로컬 스토리지에 저장하는 메서드
  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)); // 로컬 스토리지에서 고득점을 가져옴
    if (this.score > highScore) { // 현재 점수가 기존 고득점보다 높으면
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score)); // 고득점을 갱신
    }
  }

  // 현재 점수를 반환하는 메서드
  getScore() {
    return this.score; // 현재 점수를 반환
  }

  // 캔버스에 점수와 고득점을 그리는 메서드
  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY)); // 로컬 스토리지에서 고득점을 가져옴
    const y = 20 * this.scaleRatio; // 점수의 y 위치를 스케일에 맞게 설정

    const fontSize = 20 * this.scaleRatio; // 폰트 크기를 스케일에 맞게 설정
    this.ctx.font = `${fontSize}px serif`; // 폰트 설정
    this.ctx.fillStyle = '#525250'; // 텍스트 색상 설정

    // 점수와 고득점의 x 위치를 계산
    const scoreX = this.canvas.width - 75 * this.scaleRatio; // 점수의 x 위치
    const highScoreX = scoreX - 125 * this.scaleRatio; // 고득점의 x 위치

    // 점수와 고득점을 6자리로 맞추기 위해 0으로 채움
    const scorePadded = Math.floor(this.score).toString().padStart(6, 0); // 현재 점수
    const highScorePadded = highScore.toString().padStart(6, 0); // 고득점

    // 캔버스에 점수와 고득점을 그림
    this.ctx.fillText(scorePadded, scoreX, y); // 현재 점수 그리기
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y); // 고득점 그리기
  }
}

export default Score;
