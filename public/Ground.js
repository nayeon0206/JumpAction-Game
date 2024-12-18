class Ground {
    // 생성자: ctx(컨텍스트), width(너비), height(높이), speed(속도), scaleRatio(비율) 초기화
    constructor(ctx, width, height, speed, scaleRatio) {
        this.ctx = ctx; // 2D 렌더링 컨텍스트 저장
        this.canvas = ctx.canvas; // 캔버스 객체 저장
        this.width = width; // 땅의 너비
        this.height = height; // 땅의 높이
        this.speed = speed; // 땅이 움직이는 속도
        this.scaleRatio = scaleRatio; // 비율(스크롤 속도 조절 등)

        this.x = 0; // 땅의 x 좌표, 초기값은 0
        this.y = this.canvas.height - this.height; // 땅의 y 좌표, 캔버스 하단에 맞추기 위해 캔버스 높이에서 땅 높이를 뺌

        this.groundImage = new Image(); // 이미지 객체 생성
        this.groundImage.src = "images/ground.png"; // 땅 이미지를 지정한 경로로 설정
    }

    // update 메서드: 땅의 위치를 업데이트 (스크롤)
    update(gameSpeed, deltaTime) {
        // x 좌표를 게임 속도, 시간(deltaTime), 속도, 비율에 따라 왼쪽으로 이동시킴
        this.x -= gameSpeed * deltaTime * this.speed * this.scaleRatio;
    }

    // draw 메서드: 땅 이미지를 캔버스에 그리기
    draw() {
        // 첫 번째 땅 이미지를 현재 x, y 좌표에 그리기
        this.ctx.drawImage(
            this.groundImage,
            this.x,
            this.y,
            this.width,
            this.height
        );

        // 두 번째 땅 이미지를 첫 번째 땅 이미지 바로 뒤에 그리기 (연결 효과)
        this.ctx.drawImage(
            this.groundImage,
            this.x + this.width, // x 좌표는 첫 번째 이미지의 끝 부분부터 시작
            this.y,
            this.width,
            this.height
        );

        // 땅 이미지가 캔버스를 벗어나면 처음으로 돌아가도록 처리
        if (this.x < -this.width) {
            this.x = 0; // x 좌표를 0으로 초기화
        }
    }

    // reset 메서드: 땅의 위치를 처음으로 되돌리기
    reset() {
        this.x = 0; // x 좌표를 0으로 리셋
    }
}

export default Ground;