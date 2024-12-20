import { CLIENT_VERSION } from './Constants.js';

// 서버에 소켓 연결을 설정하는 부분
// 'http://localhost:3000' 서버에 연결하고, 클라이언트 버전을 쿼리 매개변수로 전달
const socket = io('http://3.35.174.130:3000', {
  query: {
    clientVersion: CLIENT_VERSION,  // CLIENT_VERSION은 코드 외부에서 정의된 클라이언트 버전 값
  },
});

// userId를 null로 초기화. 서버로부터 유저 ID가 전달되면 이 값을 설정할 예정.
let userId = null;

// 서버에서 'response' 이벤트가 발생했을 때 실행되는 리스너
// 서버가 'response' 이벤트를 발생시키면, 전달된 data를 콘솔에 출력
socket.on('response', (data) => {
  console.log(data);
});

// 서버에 연결되었을 때 'connection' 이벤트가 발생
// 서버에서 연결된 클라이언트 정보를 data로 전달하면 이를 콘솔에 출력
// 또한, 서버에서 전달된 uuid를 userId에 저장
socket.on('connection', (data) => {
  console.log('connection: ', data);
  userId = data.uuid;  // 서버가 제공하는 유저의 고유 ID (UUID)를 userId에 저장
});

// socket으로 assets파일 받아옴
// 데이터 조회해서 프론트에서 assets파일 사용
let gameAssetsData = null;
socket.on('gameAssets', (data) => {
  gameAssetsData = data;
  // console.log(gameAssetsData)
});

// 서버에 'event'라는 이벤트를 발생시키는 함수
// 클라이언트에서 이벤트를 서버로 전송할 때 사용
const sendEvent = (handlerId, payload) => {
  socket.emit('event', {
    userId,            // 유저의 고유 ID
    clientVersion: CLIENT_VERSION,  // 클라이언트 버전 정보
    handlerId,         // 이벤트를 처리할 핸들러 ID
    payload,           // 이벤트에 대한 추가 데이터 (페이로드)
  });
};

// sendEvent 함수는 다른 파일에서 사용할 수 있도록 내보냄 (export)
export { sendEvent, gameAssetsData };
