import { v4 as uuidv4 } from 'uuid';
import { addUser } from '../models/user.model.js';
import { handleConnection, handleDisconnect, handleEvent } from './helper.js';
import { getGameAssets } from '../init/assets.js';

const registerHandler = (io) => { 
  // registerHandler 함수는 'io' 객체를 인자로 받아 연결된 클라이언트들의 이벤트를 처리하는 역할을 함.
  io.on('connection', (socket) => { 
    // 클라이언트가 서버에 연결될 때마다 호출되는 'connection' 이벤트 처리.
    // 최초 커넥션을 맺은 이후 발생하는 각종 이벤트를 처리하는 곳

    const userUUID = uuidv4();
    // UUID 생성: 각 사용자에게 고유한 식별자를 부여하기 위해 'uuidv4' 함수로 UUID를 생성
    addUser({ uuid: userUUID, socketId: socket.id });
    // 사용자 추가: 생성된 UUID와 socket.id를 사용하여 사용자 목록에 추가. (사용자를 식별하는 데 사용)

    handleConnection(socket, userUUID); 
    // 커넥션 처리: 클라이언트가 연결될 때마다 추가적인 처리(예: 초기화, 알림 등)를 하는 함수 호출.

    const gameAssets = getGameAssets();
    socket.emit('gameAssets', gameAssets);

    // 모든 서비스 이벤트 처리
    socket.on('event', (data) => handleEvent(io, socket, data));
    // 클라이언트에서 'event'라는 이름으로 전송된 이벤트를 처리.
    // 데이터는 'data'로 전달됨. 이 데이터를 기반으로 'handleEvent' 함수 호출.
    
    // 접속 해제시 이벤트 처리
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    // 클라이언트가 연결을 끊을 때 호출되는 'disconnect' 이벤트를 처리.
    // 연결이 끊어진 클라이언트에 대한 후속 처리를 위해 'handleDisconnect' 함수 호출.
  });
};

export default registerHandler;
// 이 모듈에서 정의된 'registerHandler' 함수를 외부에서 사용할 수 있도록 내보냄.

