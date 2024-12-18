// model/user.model.js
// 사용자의 데이터를 저장할 빈 배열을 초기화합니다.
const users = [];

// 새로운 사용자를 `users` 배열에 추가하는 함수입니다.
// 이 함수는 `user` 객체를 매개변수로 받아 `users` 배열에 추가합니다.
export const addUser = (user) => {
  users.push(user); // `users` 배열에 user 객체를 추가합니다.
};

// `socketId`를 기준으로 사용자를 `users` 배열에서 제거하는 함수입니다.
// 이 함수는 `socketId`를 매개변수로 받아 해당 사용자를 삭제합니다.
export const removeUser = (socketId) => {
  // `users` 배열에서 `socketId`가 일치하는 사용자의 인덱스를 찾습니다.
  const index = users.findIndex((user) => user.socketId === socketId);
  
  // 사용자가 발견되었을 경우 (즉, index가 -1이 아닐 때) 해당 사용자를 배열에서 제거합니다.
  if (index !== -1) {
    // `splice` 메서드를 사용하여 해당 인덱스의 사용자를 삭제합니다.
    // `splice`는 삭제된 요소를 배열로 반환하므로, 그중 첫 번째 요소를 반환합니다.
    return users.splice(index, 1)[0];
  }
};

// 현재 연결된 모든 사용자 목록을 가져오는 함수입니다.
// `users` 배열의 모든 사용자 객체를 반환합니다.
export const getUsers = () => {
  return users; // `users` 배열의 현재 상태를 반환합니다.
};

// 목적:
// 이 코드는 서버에서 연결된 사용자들의 목록을 관리하기 위한 기능을 제공합니다.
// 주로 실시간 웹 애플리케이션(예: 채팅 애플리케이션, 멀티플레이어 게임)에서 사용됩니다.

// 함수 설명:
// addUser: 새로운 사용자를 목록에 추가합니다.
// removeUser: socketId를 기준으로 사용자를 목록에서 제거합니다.
// getUsers: 현재 연결된 모든 사용자의 목록을 반환합니다.

// 핵심 개념:
// users 배열은 이 모듈에서 관리하는 전역 배열로, 연결된 사용자 객체들을 저장합니다.
// 사용자 객체에는 일반적으로 socketId(각 연결을 식별하는 고유 값)와 사용자 관련 정보가 포함됩니다.
// findIndex 메서드를 사용하여 특정 socketId를 가진 사용자를 정확히 찾아냅니다. 이를 통해 특정 사용자를 효율적으로 관리할 수 있습니다.

// 실제 사용 예:
// 이 코드는 socket.io와 같은 실시간 통신 라이브러리를 사용하는 애플리케이션의 서버 로직에서 자주 사용됩니다.
// 사용자 객체 예시: { username: 'JohnDoe', socketId: 'abc123', room: 'chatRoom1' }
// 사용자는 연결 시 addUser 함수로 추가되고, 연결이 종료되면 removeUser 함수로 목록에서 제거됩니다. getUsers를 통해 현재 연결된 사용자 목록을 확인할 수 있습니다.
