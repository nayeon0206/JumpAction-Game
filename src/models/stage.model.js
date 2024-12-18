const stages = {}; 
// 각 UUID를 키로 사용하여 스테이지 데이터를 저장할 객체입니다.
// 이 객체는 여러 사용자의 스테이지 정보를 관리하기 위해 사용됩니다.

export const createStage = (uuid) => {
  stages[uuid] = []; 
  // 특정 사용자의 UUID에 해당하는 스테이지 배열을 초기화합니다.
  // 초기화된 배열은 이후 스테이지 데이터(id, timestamp)를 추가할 때 사용됩니다.
};

export const getStage = (uuid) => {
  return stages[uuid]; 
  // 전달받은 UUID에 해당하는 스테이지 배열을 반환합니다.
  // 이 함수는 사용자의 현재 스테이지 데이터를 조회하는 데 사용됩니다.
};

export const setStage = (uuid, id, timestamp) => {
  return stages[uuid].push({ id, timestamp }); 
  // 전달받은 UUID의 스테이지 배열에 새로운 데이터를 추가합니다.
  // id는 스테이지의 고유 식별자이고, timestamp는 해당 스테이지 생성 시간을 나타냅니다.
  // 예: { id: 1, timestamp: "2024-12-18T12:00:00Z" }
};

export const clearStage = (uuid) => {
  return (stages[uuid] = []); 
  // 특정 사용자의 UUID에 해당하는 스테이지 배열을 초기화(비우기)합니다.
  // 사용자의 진행 상태를 리셋하거나 초기화할 때 사용됩니다.
};

// 코드 설명
// 이 코드는 여러 사용자가 각각의 스테이지 데이터를 개별적으로 관리할 수 있도록 설계되었습니다.
// stages 객체는 사용자 ID(uuid)를 키로 사용하여 각 사용자의 데이터를 저장하고, 이를 통해 스테이지를 추가하거나 조회 및 초기화할 수 있습니다.

// 함수 활용 예시

// createStage(uuid)
// 사용자가 새로 시작하거나 스테이지 데이터를 초기화할 때 호출합니다.

// getStage(uuid)
// 사용자의 현재 진행 상황(스테이지 배열)을 확인할 때 호출합니다.

// setStage(uuid, id, timestamp)
// 새로운 스테이지를 추가할 때 호출합니다.
// 예: 사용자가 새로운 스테이지를 완료하거나 생성할 때 사용.

// clearStage(uuid)
// 사용자의 진행 상황을 초기화하거나 재시작할 때 호출합니다.