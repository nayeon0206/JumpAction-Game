import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';

const app = express(); // Express 모듈을 사용하여 애플리케이션 객체를 생성합니다. 
// 이 객체는 서버의 주요 기능(라우팅, 미들웨어 사용 등)을 설정하고 실행하는 데 사용됩니다.

const server = createServer(app); // Node.js의 HTTP 서버를 생성하며, Express 애플리케이션을 전달하여 요청을 처리하도록 설정합니다.

const PORT = 3000; // 서버가 요청을 대기할 포트 번호를 정의합니다. 
// 클라이언트는 http://localhost:3000으로 접속하여 서버와 통신할 수 있습니다.

// 정적 파일 제공 미들웨어 설정
app.use(express.static('public')); // 'public' 디렉토리에 저장된 파일을 정적 파일로 제공하도록 설정합니다. 
// 예: http://localhost:3000/index.html로 접근 가능.

// JSON 요청 본문 파싱 미들웨어 추가
app.use(express.json()); // 클라이언트가 서버로 JSON 데이터를 전송했을 때 이를 JavaScript 객체로 변환합니다.
// 예: POST 요청의 본문에 { "name": "player" }라는 JSON 데이터가 포함되어 있을 경우,
// req.body.name은 'player' 값을 반환합니다.

// URL 인코딩된 요청 데이터 파싱 미들웨어 추가
app.use(express.urlencoded({ extended: false })); 
// 클라이언트가 x-www-form-urlencoded 형식으로 데이터를 보낼 경우 이를 파싱합니다.
// extended 옵션이 false일 경우 중첩된 객체를 단순 객체로 제한합니다.

// 실시간 통신을 위한 소켓 연결 초기화
initSocket(server); 
// WebSocket 또는 다른 실시간 통신을 위해 소켓 초기화를 수행하는 사용자 정의 함수로 추정됩니다. 
// 서버와 클라이언트 간의 실시간 데이터 교환을 지원합니다.

// HTTP GET 요청에 대한 기본 라우트 정의
app.get('/', (req, res) => { 
  // 클라이언트가 '/' 경로로 GET 요청을 보낼 경우 실행됩니다.
  res.send('<h1>Hello World</h1>'); // 클라이언트에게 HTML 형식의 응답을 보냅니다.
  // 예: 브라우저에서 http://localhost:3000으로 접속하면 "Hello World"가 화면에 출력됩니다.
});

// 서버 시작 및 포트 리스닝
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`); 
  // 서버가 성공적으로 시작되고 지정된 포트에서 요청을 대기 중임을 알리는 로그를 출력합니다.

  try {
    // 게임 관련 에셋(리소스, 파일 등)을 비동기로 로드하는 함수 호출
    const assets = await loadGameAssets(); 
    // 비동기 함수를 사용하여 에셋 로드가 완료될 때까지 기다립니다.

    console.log(assets); // 로드된 에셋 데이터를 콘솔에 출력하여 확인합니다.
    console.log('Assets loaded successfully'); // 에셋 로드 성공 시 성공 메시지를 출력합니다.
  } catch (error) {
    // 에셋 로드 중 문제가 발생한 경우 실행되는 코드 블록
    console.error('Failed to load game assets:', error); 
    // 에러 메시지와 함께 문제의 원인을 로그로 출력하여 디버깅에 도움을 줍니다.
  }
});

