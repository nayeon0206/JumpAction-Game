import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import './Socket.js';
import { sendEvent } from './Socket.js';

const canvas = document.getElementById('game'); // 게임 캔버스를 가져옵니다.
const ctx = canvas.getContext('2d'); // 2D 컨텍스트를 사용하여 캔버스에 그립니다.

const GAME_SPEED_START = 1; // 게임의 초기 속도
const GAME_SPEED_INCREMENT = 0.00001; // 게임 속도 증가 비율

// 게임 크기 설정
const GAME_WIDTH = 800; // 게임 캔버스 너비
const GAME_HEIGHT = 200; // 게임 캔버스 높이

// 플레이어 설정
const PLAYER_WIDTH = 88 / 1.5; // 플레이어 캐릭터의 너비 (비율에 맞게 크기 조정)
const PLAYER_HEIGHT = 94 / 1.5; // 플레이어 캐릭터의 높이 (비율에 맞게 크기 조정)
const MAX_JUMP_HEIGHT = GAME_HEIGHT; // 최대 점프 높이 (게임 화면의 높이)
const MIN_JUMP_HEIGHT = 150; // 최소 점프 높이

// 땅 설정
const GROUND_WIDTH = 2400; // 땅의 너비
const GROUND_HEIGHT = 24; // 땅의 높이
const GROUND_SPEED = 0.5; // 땅의 이동 속도

// 선인장 설정 (선인장의 크기와 이미지 경로)
const CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
  { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
  { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' },
];

// 아이템 설정 (아이템 크기, ID, 이미지 경로)
const ITEM_CONFIG = [
  { width: 50 / 1.5, height: 50 / 1.5, id: 1, image: 'images/items/pokeball_red.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 2, image: 'images/items/pokeball_yellow.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 3, image: 'images/items/pokeball_purple.png' },
  { width: 50 / 1.5, height: 50 / 1.5, id: 4, image: 'images/items/pokeball_cyan.png' },
];

// 게임 요소 초기화
let player = null;
let ground = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = null; // 화면 비율을 계산할 변수
let previousTime = null; // 이전 시간
let gameSpeed = GAME_SPEED_START; // 초기 게임 속도
let gameover = false; // 게임 종료 여부
let hasAddedEventListenersForRestart = false; // 게임 재시작 이벤트 리스너 추가 여부
let waitingToStart = true; // 게임 시작 대기 여부

// 게임에 등장하는 모든 스프라이트를 생성하는 함수
function createSprites() {
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio; // 게임에 맞게 플레이어 너비
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio; // 게임에 맞게 플레이어 높이
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio; // 최소 점프 높이 조정
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio; // 최대 점프 높이 조정

  const groundWidthInGame = GROUND_WIDTH * scaleRatio; // 게임에 맞게 땅 너비
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio; // 게임에 맞게 땅 높이

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

  // 선인장 이미지를 불러와 설정
  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);

  // 아이템 이미지를 불러와 설정
  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
    };
  });

  itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED);

  score = new Score(ctx, scaleRatio); // 점수 초기화
}

// 화면 비율을 계산하는 함수
function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight); // 화면 높이
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth); // 화면 너비

  // 화면 비율에 맞춰 게임 화면 크기를 조정
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

// 게임 화면을 설정하는 함수
function setScreen() {
  scaleRatio = getScaleRatio(); // 비율 계산
  canvas.width = GAME_WIDTH * scaleRatio; // 캔버스 너비 설정
  canvas.height = GAME_HEIGHT * scaleRatio; // 캔버스 높이 설정
  createSprites(); // 게임 요소들 생성
}

// 화면 크기 변경 시 새로 설정
setScreen();
window.addEventListener('resize', setScreen);

// 화면 회전 시 새로 설정 (모바일 기기에서 주로 사용)
if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

// 게임 오버 메시지를 표시하는 함수
function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y); // 게임 오버 텍스트 출력
}

// 게임 시작 텍스트를 표시하는 함수
function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText('Tap Screen or Press Space To Start', x, y); // 시작 메시지 출력
}

// 게임 속도를 증가시키는 함수
function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT; // 시간에 비례하여 게임 속도 증가
}

// 게임을 초기화하는 함수
function reset() {
  hasAddedEventListenersForRestart = false; // 재시작 리스너를 다시 추가하지 않도록 설정
  gameover = false; // 게임 오버 상태 초기화
  waitingToStart = false; // 게임 시작 대기 상태 해제

  ground.reset(); // 땅 초기화
  cactiController.reset(); // 선인장 초기화
  score.reset(); // 점수 초기화
  gameSpeed = GAME_SPEED_START; // 게임 속도 초기화
  sendEvent(2, { timestamp: Date.now() }); // 이벤트 전송 (타이밍 관련)
}

// 게임 재시작 이벤트 리스너를 설정하는 함수
function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    // 게임 오버 후 1초 뒤에 키 입력을 기다리며 게임을 리셋
    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true }); // 한 번만 키 입력을 받음
    }, 1000);
  }
}

// 화면을 깨끗하게 지우는 함수
function clearScreen() {
  ctx.fillStyle = 'white'; // 흰색으로 배경 채우기
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체에 흰색으로 채우기
}

// 게임 루프 (프레임마다 호출됨)
function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime; // 첫 번째 호출 시 이전 시간을 현재 시간으로 설정
    requestAnimationFrame(gameLoop); // 다음 프레임을 요청
    return;
  }

  // 프레임 렌더링 속도를 계산하기 위한 값
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime; // 현재 시간을 이전 시간으로 설정

  clearScreen(); // 화면 지우기

  if (!gameover && !waitingToStart) {
    // 게임 진행 중일 때 (게임 오버 상태가 아닐 때)
    ground.update(gameSpeed, deltaTime); // 땅 업데이트
    cactiController.update(gameSpeed, deltaTime); // 선인장 업데이트
    itemController.update(gameSpeed, deltaTime); // 아이템 업데이트
    player.update(gameSpeed, deltaTime); // 플레이어 업데이트
    updateGameSpeed(deltaTime); // 게임 속도 업데이트

    score.update(deltaTime); // 점수 업데이트
  }

  if (!gameover && cactiController.collideWith(player)) {
    gameover = true; // 선인장과 충돌하면 게임 오버
    score.setHighScore(); // 최고 점수 설정
    setupGameReset(); // 게임 리셋 준비
  }

  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    score.getItem(collideWithItem.itemId); // 아이템 획득
  }

  // 화면에 그리기
  player.draw(); // 플레이어 그리기
  cactiController.draw(); // 선인장 그리기
  ground.draw(); // 땅 그리기
  score.draw(); // 점수 그리기
  itemController.draw(); // 아이템 그리기

  if (gameover) {
    showGameOver(); // 게임 오버 메시지 표시
  }

  if (waitingToStart) {
    showStartGameText(); // 게임 시작 메시지 표시
  }

  requestAnimationFrame(gameLoop); // 계속해서 게임 루프 호출
}

// 게임 루프 시작
requestAnimationFrame(gameLoop);

// 키보드 이벤트 리스너로 게임 초기화 설정
window.addEventListener('keyup', reset, { once: true });
