// gameAssets.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// import.meta.url은 현재 모듈의 URL을 나타내는 문자열
// fileURLToPath는 URL 문자열을 파일 시스템의 경로로 변환

// 현재 파일의 절대 경로. 이 경로는 파일의 이름을 포함한 전체 경로
const __filename = fileURLToPath(import.meta.url);

// path.dirname() 함수는 파일 경로에서 디렉토리 경로만 추출 (파일 이름을 제외한 디렉토리의 전체 경로)
const __dirname = path.dirname(__filename);
// `path` 모듈을 사용하여 파일 경로를 관리
const basePath = path.join(__dirname, '../../assets'); 
// basePath는 현재 파일의 디렉터리를 기준으로 '../../assets' 경로를 설정.
// 즉, assets 폴더에 접근하기 위한 기본 경로를 설정.

// 전역 변수로 gameAssets 선언. 게임 데이터를 여기에 저장하여 다른 모듈에서도 접근할 수 있도록 한다.
let gameAssets = {}; 

// 비동기적으로 파일을 읽어오는 함수 선언
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    // fs.readFile을 사용하여 파일 내용을 비동기로 읽어옴
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) { 
        // 파일 읽기 실패 시 reject로 에러를 반환
        reject(err);
        return;
      }
      // 파일 읽기 성공 시 JSON 형식으로 파싱하여 resolve로 반환
      resolve(JSON.parse(data));
    });
  });
};

// 게임 데이터를 로드하는 함수
export const loadGameAssets = async () => {
  try {
    // Promise.all을 사용하여 여러 파일을 동시에 읽어옴
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),        // 스테이지 관련 데이터를 로드
      readFileAsync('item.json'),         // 아이템 데이터를 로드
      readFileAsync('item_unlock.json'),  // 아이템 잠금 해제 관련 데이터를 로드
    ]);
    // 읽어온 데이터를 gameAssets 객체에 저장
    gameAssets = { stages, items, itemUnlocks };
    return gameAssets; // 로드한 데이터를 반환
  } catch (error) {
    // 에러 발생 시 에러 메시지를 추가하여 새로운 에러를 throw
    throw new Error('Failed to load game assets: ' + error.message);
  }
};

// 이미 로드된 게임 데이터를 반환하는 함수
export const getGameAssets = () => {
  return gameAssets; // 전역 변수 gameAssets를 반환
};


//
// 주석 설명:
// 1. **basePath 설정**:
//    - 파일 경로를 미리 설정하여 코드에서 파일 이름만 전달해도 해당 디렉토리에서 파일을 읽을 수 있도록 한다.
//    - 코드 유지보수를 쉽게 만들고 경로 설정을 일원화한다.

// 2. readFileAsync 함수**:
//    - `fs.readFile`을 프로미스 방식으로 감싸 비동기적으로 데이터를 읽을 수 있게 만든다.
//    - 에러가 발생하면 `reject`로 에러를 반환하고, 정상적으로 읽으면 데이터를 JSON으로 파싱해 반환한다.

// 3. loadGameAssets 함수**:
//    - JSON 파일 3개를 병렬로 비동기 처리하여 게임 데이터를 로드한다.
//    - `Promise.all`을 사용하면 여러 파일을 동시에 읽어 속도를 개선할 수 있다.
//    - 로드된 데이터를 `gameAssets` 전역 변수에 저장해 재사용 가능하도록 한다.

// 4. getGameAssets 함수**:
//    - 이미 로드된 데이터를 반환하는 함수.
//    - 데이터가 필요한 다른 모듈에서 호출하여 게임 데이터를 가져올 수 있다.

// 주의사항:
// - `basePath` 및 파일 이름이 올바른지 확인해야 함.
// - JSON 파일 형식이 정확해야 파싱 에러가 발생하지 않음.
// - `fs`와 `path` 모듈이 필요한 코드이므로 상단에 import 구문 추가 필요:
//   const fs = require('fs');
//   const path = require('path')