import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

// initSocket 함수: 서버에 소켓 연결을 초기화하는 함수
const initSocket = (server) => {
  // 1. Socket.IO 인스턴스 생성
  // Socket.IO는 실시간 양방향 통신을 제공하는 라이브러리입니다.
  // 이를 사용하면 서버와 클라이언트 간의 실시간 데이터 교환이 가능합니다.
  const io = new SocketIO();

  // 2. 서버와 소켓 연결
  // attach 메서드는 Socket.IO를 제공된 HTTP 서버에 연결합니다.
  // 이렇게 하면 서버가 소켓 통신 기능을 사용할 수 있게 됩니다.
  io.attach(server);

  // 3. 이벤트 핸들러 등록
  // registerHandler는 서버와 클라이언트 간의 통신에서 발생하는 이벤트를 처리하는 함수입니다.
  // Socket.IO의 이벤트 리스너를 등록하여 특정 이벤트가 발생했을 때 처리할 작업을 정의합니다.
  registerHandler(io);
};

// initSocket 함수는 다른 파일에서도 사용할 수 있도록 기본으로 내보냄 (export default).
export default initSocket;



// Socket.IO 인스턴스 생성: SocketIO()는 서버에서 실시간 데이터를 송수신할 수 있는 소켓 객체를 생성합니다.
// io.attach(server): 제공된 server는 HTTP(S) 서버 객체입니다. 이 메서드는 서버와 Socket.IO를 연결하여 소켓 통신이 가능하도록 설정합니다.
// registerHandler(io): 소켓에서 발생하는 이벤트를 처리하기 위해 핸들러를 등록합니다. 이 함수는 주로 클라이언트의 연결, 메시지 전송, 연결 해제와 같은 이벤트를 처리하는 데 사용됩니다.
// 이 코드는 기본적으로 HTTP 서버와 소켓을 통합하여 실시간 데이터 교환을 가능하게 하는 초기화 로직입니다.
// initSocket 함수는 서버 설정의 핵심 부분으로, 다른 서버 파일에서 쉽게 재사용할 수 있도록 설계되었습니다.
