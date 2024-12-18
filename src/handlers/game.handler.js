import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  // 게임의 시작을 처리하는 함수입니다.
  // uuid: 사용자 고유 식별자
  // payload: 클라이언트에서 전달된 데이터(예: 타임스탬프)

  const { stages } = getGameAssets(); // 게임의 자원(스테이지 데이터 등)을 가져옵니다.
  clearStage(uuid); // 사용자의 기존 스테이지 데이터를 초기화합니다.
  setStage(uuid, stages.data[0].id, payload.timestamp); // 첫 번째 스테이지를 설정하고 시작 시간을 저장합니다.
  console.log('Stage:', getStage(uuid)); // 현재 설정된 스테이지 정보를 로그로 출력합니다.

  return { status: 'success' }; // 게임 시작 성공 상태를 반환합니다.
};

export const gameEnd = (uuid, payload) => {
  // 클라이언트에서 전달된 게임 종료 요청을 처리하는 함수입니다.
  // uuid: 사용자 고유 식별자
  // payload: 클라이언트에서 전달된 데이터(게임 종료 시간, 점수 등)

  const { timestamp: gameEndTime, score } = payload; // 게임 종료 시 클라이언트에서 받은 데이터 추출
  const stages = getStage(uuid); // 사용자의 스테이지 데이터를 가져옵니다.

  if (!stages.length) {
    // 스테이지 데이터가 없을 경우 실패 응답 반환
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 기반으로 총 점수를 계산합니다.
  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 종료 시간은 게임 종료 시간으로 설정합니다.
      stageEndTime = gameEndTime;
    } else {
      // 현재 스테이지의 종료 시간은 다음 스테이지의 시작 시간으로 설정합니다.
      stageEndTime = stages[index + 1].timestamp;
    }
    const stageDuration = (stageEndTime - stage.timestamp) / 1000; // 스테이지의 지속 시간을 초 단위로 계산
    totalScore += stageDuration; // 1초당 1점씩 점수를 누적
  });

  // 클라이언트에서 보낸 점수와 서버에서 계산한 점수를 비교하여 검증합니다.
  // 허용 오차 범위는 +- 5로 설정
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' }; // 점수 검증 실패 시 반환
  }

  // 점수 검증 성공 시, 클라이언트에서 제공한 점수를 저장하는 로직을 추가할 수 있습니다.
  // 예: saveGameResult(userId, clientScore, gameEndTime);

  // 점수 검증이 통과되면 성공 응답 반환
  return { status: 'success', message: 'Game ended successfully', score };
};
