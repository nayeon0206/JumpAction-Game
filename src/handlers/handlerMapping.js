import { moveStageHandler } from './stage.handler.js';
import { gameEnd, gameStart } from './game.handler.js';

const handlerMappings = {
  2: gameStart, // 키값 2에 gameStart 함수를 맵핑: 이 키는 게임이 시작될 때 호출되는 함수입니다.
  3: gameEnd,   // 키값 3에 gameEnd 함수를 맵핑: 이 키는 게임이 끝났을 때 호출되는 함수입니다.
  11: moveStageHandler, // 키값 11에 moveStageHandler 함수를 맵핑: 이 키는 플레이어가 스테이지를 이동할 때 호출되는 함수입니다.
};

export default handlerMappings; // handlerMappings 객체를 다른 파일에서 사용할 수 있도록 내보냄

