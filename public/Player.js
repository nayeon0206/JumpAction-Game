class Player {
    // 달리기 애니메이션 타이머 설정 (200ms)
    WALK_ANIMATION_TIMER = 200;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;  // 타이머 초기화
    dinoRunImages = [];  // 달리기 이미지 배열

    // 점프 관련 상태값
    jumpPressed = false;  // 점프 버튼이 눌렸는지 여부
    jumpInProgress = false;  // 점프가 진행 중인지 여부
    falling = false;  // 낙하 상태 여부

    // 점프 속도와 중력 설정
    JUMP_SPEED = 0.6;  // 점프 속도
    GRAVITY = 0.4;  // 중력 값

    // 생성자 (Player 객체를 초기화)
    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;  // 렌더링할 Canvas의 context
        this.canvas = ctx.canvas;  // canvas 객체
        this.width = width;  // 캐릭터의 가로 크기
        this.height = height;  // 캐릭터의 세로 크기
        this.minJumpHeight = minJumpHeight;  // 최소 점프 높이
        this.maxJumpHeight = maxJumpHeight;  // 최대 점프 높이
        this.scaleRatio = scaleRatio;  // 크기 비율 (게임 화면 크기에 맞게 크기 조정)

        this.x = 10 * scaleRatio;  // x 위치 (왼쪽에서 10의 크기만큼 떨어진 위치)
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio;  // y 위치 (화면 바닥에서 캐릭터 크기와 비율만큼 떨어짐)
        this.yStandingPosition = this.y;  // 원래 서 있는 위치 (점프 후 복귀할 위치)

        // 서 있는 상태 이미지
        this.standingStillImage = new Image();
        this.standingStillImage.src = "images/standing_still.png";  // 서 있는 이미지 파일 경로
        this.image = this.standingStillImage;  // 초기 이미지 설정 (서 있는 상태)

        // 달리기 애니메이션 이미지 배열에 이미지 추가
        const dinoRunImage1 = new Image();
        dinoRunImage1.src = "images/dino_run1.png";  // 달리는 이미지 1
        const dinoRunImage2 = new Image();
        dinoRunImage2.src = "images/dino_run2.png";  // 달리는 이미지 2
        this.dinoRunImages.push(dinoRunImage1);
        this.dinoRunImages.push(dinoRunImage2);

        // 키보드 이벤트 처리
        // 기존 이벤트가 있을 경우 제거하고 새로운 이벤트 리스너 등록
        window.removeEventListener("keydown", this.keydown);
        window.removeEventListener("keyup", this.keyup);

        // 키보드 이벤트 리스너 등록
        window.addEventListener("keydown", this.keydown);
        window.addEventListener("keyup", this.keyup);
    }

    // keydown 이벤트 핸들러: 스페이스 키를 눌렀을 때 jumpPressed를 true로 설정
    keydown = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = true;
        }
    };

    // keyup 이벤트 핸들러: 스페이스 키에서 손을 뗐을 때 jumpPressed를 false로 설정
    keyup = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = false;
        }
    };

    // 게임 상태 업데이트
    update(gameSpeed, deltaTime) {
        this.run(gameSpeed, deltaTime);  // 달리기 애니메이션 업데이트

        if (this.jumpInProgress) {
            this.image = this.standingStillImage;  // 점프 중에는 서 있는 이미지로 변경
        }

        this.jump(deltaTime);  // 점프 상태 업데이트
    }

    // 점프 처리
    jump(deltaTime) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;  // 스페이스 키를 눌렀을 때 점프 시작
        }

        // 점프가 진행 중이고 떨어지지 않았다면
        if (this.jumpInProgress && !this.falling) {
            // 점프 중, 최소 점프 높이와 최대 점프 높이 사이에서 올라감
            if ((this.y > this.canvas.height - this.minJumpHeight) ||
                (this.y > this.canvas.height - this.maxJumpHeight) && this.jumpPressed) {
                this.y -= this.JUMP_SPEED * deltaTime * this.scaleRatio;  // 점프
            } else {
                this.falling = true;  // 최대 점프 높이에 도달하면 떨어지기 시작
            }
        } else {
            // 떨어지는 중일 때
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * deltaTime * this.scaleRatio;  // 중력에 의해 떨어짐

                // 캐릭터가 화면 밖으로 나가지 않도록 위치 조정
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;  // 바닥에 닿으면 원래 위치로 복귀
                }
            } else {
                this.falling = false;  // 떨어짐 종료
                this.jumpInProgress = false;  // 점프 종료
            }
        }
    }

    // 달리기 애니메이션 처리
    run(gameSpeed, deltaTime) {
        if (this.walkAnimationTimer <= 0) {
            // 애니메이션 타이머가 0이면 이미지 변경
            if (this.image === this.dinoRunImages[0]) {
                this.image = this.dinoRunImages[1];  // 두 번째 이미지로 변경
            } else {
                this.image = this.dinoRunImages[0];  // 첫 번째 이미지로 변경
            }
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;  // 타이머 초기화
        }

        // 타이머 감소
        this.walkAnimationTimer -= deltaTime * gameSpeed;
    }

    // 화면에 그리기
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);  // 현재 이미지를 x, y 위치에 그리기
    }
}


export default Player;