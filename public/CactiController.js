import Cactus from "./Cactus.js";

class CactiController {

    // 선인장이 생성될 간격의 최소값과 최대값을 정의합니다.
    CACTUS_INTERVAL_MIN = 500;
    CACTUS_INTERVAL_MAX = 2000;

    nextCactusInterval = null;  // 다음 선인장이 생성될 시간을 저장하는 변수
    cacti = [];  // 생성된 선인장을 저장할 배열

    // 생성자: ctx는 게임의 canvas 렌더링 컨텍스트, cactiImages는 선인장의 이미지들, scaleRatio는 크기 비율, speed는 이동 속도
    constructor(ctx, cactiImages, scaleRatio, speed) {
        this.ctx = ctx;  // 렌더링 컨텍스트
        this.canvas = ctx.canvas;  // canvas 요소
        this.cactiImages = cactiImages;  // 선인장 이미지 배열
        this.scaleRatio = scaleRatio;  // 크기 비율 (게임 크기 비율)
        this.speed = speed;  // 선인장의 이동 속도

        this.setNextCactusTime();  // 첫 선인장이 생성될 시간 설정
    }

    // 다음 선인장이 생성될 시간을 랜덤으로 설정하는 함수
    setNextCactusTime() {
        this.nextCactusInterval = this.getRandomNumber(
            this.CACTUS_INTERVAL_MIN,
            this.CACTUS_INTERVAL_MAX
        );
    }

    // 주어진 최소값과 최대값 사이에서 랜덤한 숫자를 반환하는 함수
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 새로운 선인장을 생성하는 함수
    createCactus() {
        const index = this.getRandomNumber(0, this.cactiImages.length - 1);  // 랜덤한 선인장 이미지 선택
        const cactusImage = this.cactiImages[index];  // 선택된 이미지
        const x = this.canvas.width * 1.5;  // 선인장의 초기 x 좌표 (화면의 오른쪽 끝에 가까운 위치)
        const y = this.canvas.height - cactusImage.height;  // 선인장의 초기 y 좌표 (화면의 바닥에 맞추기)

        // 선인장 객체를 생성하여 cacti 배열에 추가
        const cactus = new Cactus(
            this.ctx,
            x,
            y,
            cactusImage.width,
            cactusImage.height,
            cactusImage.image
        );

        this.cacti.push(cactus);  // 생성된 선인장 배열에 추가
    }

    // 게임의 진행 상태에 맞게 선인장들을 업데이트하는 함수
    update(gameSpeed, deltaTime) {
        if(this.nextCactusInterval <= 0) {
            // 선인장이 생성될 시간이 되면 새 선인장을 생성하고, 다음 선인장이 생성될 시간을 설정
            this.createCactus();
            this.setNextCactusTime();
        }

        // 선인장 생성 대기 시간 감소 (델타타임에 맞춰 업데이트)
        this.nextCactusInterval -= deltaTime;

        // 생성된 선인장들을 업데이트
        this.cacti.forEach((cactus) => {
            cactus.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        });

        // 화면을 벗어난 선인장들 삭제 (선인장이 왼쪽 끝으로 지나가면 배열에서 제거)
        this.cacti = this.cacti.filter(cactus => cactus.x > -cactus.width);
    }

    // 화면에 선인장을 그리는 함수
    draw() {
        this.cacti.forEach((cactus) => cactus.draw());  // 모든 선인장을 그립니다.
    }

    // 다른 객체와 선인장이 충돌했는지 확인하는 함수
    collideWith(sprite) {
        // 선인장 배열에서 하나라도 충돌하면 true 반환
        return this.cacti.some(cactus => cactus.collideWith(sprite));
    }

    // 선인장들을 초기화하는 함수 (게임 재시작 시 등)
    reset() {
        this.cacti = [];  // 선인장 배열 초기화
    }
}

export default CactiController;