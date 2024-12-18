import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

// 새 사용자가 연결될 때 처리하는 함수
export const handleConnection = (socket, userUUID) => {
  // 새 사용자가 연결되었음을 콘솔에 출력
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  // 현재 연결된 사용자 목록을 콘솔에 출력
  console.log('Current users:', getUsers());

  // 해당 사용자의 UUID로 새로운 스테이지(빈 배열)를 생성
  createStage(userUUID);

  // 클라이언트로 연결 완료 이벤트를 전송하며 사용자 UUID를 포함
  socket.emit('connection', { uuid: userUUID });
};

// 사용자가 연결 해제될 때 처리하는 함수
export const handleDisconnect = (socket, uuid) => {
  // socket ID를 사용하여 사용자 정보를 삭제
  removeUser(socket.id);
  // 사용자가 연결 해제되었음을 콘솔에 출력
  console.log(`User disconnected: ${socket.id}`);
  // 현재 남아 있는 사용자 목록을 콘솔에 출력
  console.log('Current users:', getUsers());
};

// 클라이언트에서 발생한 특정 이벤트를 처리하는 함수
export const handleEvent = (io, socket, data) => {
  // 클라이언트 버전 검증 (data.clientVersion이 허용된 버전인지 확인)
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    // 클라이언트 버전이 맞지 않을 경우 실패 메시지를 클라이언트로 전송
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return; // 함수 종료
  }

  // 핸들러 ID에 해당하는 처리기를 가져옴 (handlerMappings 객체에서 검색)
  const handler = handlerMappings[data.handlerId];
  // 유효하지 않은 핸들러 ID일 경우 실패 메시지를 클라이언트로 전송
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return; // 함수 종료
  }

  // 핸들러를 실행하여 응답 데이터를 생성 (userId와 payload 전달)
  const response = handler(data.userId, data.payload);
  
  // 응답에 `broadcast` 플래그가 있으면 모든 클라이언트에게 브로드캐스트 메시지를 전송
  if (response.broadcast) {
    io.emit('response', 'broadcast'); // 모든 클라이언트로 전송
    return;
  }
  
  // 그렇지 않으면 해당 클라이언트에게만 응답 데이터를 전송
  socket.emit('response', response);
};

