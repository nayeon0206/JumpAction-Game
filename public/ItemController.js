import Item from "./Item.js";

class ItemController {

    // 아이템 생성 간격을 설정하는 최소값과 최대값
    INTERVAL_MIN = 0;
    INTERVAL_MAX = 12000;

    nextInterval = null; // 다음 아이템 생성 시간을 추적
    items = []; // 생성된 아이템들을 저장할 배열

    // 생성자 함수, 아이템을 그리기 위한 context, 아이템 이미지, 크기 비율, 속도 등을 받음
    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx; // 캔버스의 context를 저장
        this.canvas = ctx.canvas; // 캔버스 요소 자체를 저장
        this.itemImages = itemImages; // 아이템 이미지를 저장한 배열
        this.scaleRatio = scaleRatio; // 아이템 크기를 조정할 비율
        this.speed = speed; // 아이템의 이동 속도

        this.setNextItemTime(); // 처음에 아이템이 언제 생성될지 시간 설정
    }

    // 다음 아이템을 생성할 시간을 랜덤하게 설정
    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }

    // 주어진 범위에서 랜덤한 숫자를 반환하는 함수
    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 새로운 아이템을 생성하는 함수
    createItem(stage) {
        // 스테이지별 아이템 생성
        const index = this.getRandomNumber(0, stage);
        const itemInfo = this.itemImages[index]; // 선택된 아이템 정보

        // 아이템의 초기 x, y 좌표 설정 (x는 캔버스 너비의 1.5배 지점에서 시작)
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );

        // 아이템 객체 생성
        const item = new Item(
            this.ctx,
            itemInfo.id,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image
        );

        // 생성된 아이템을 items 배열에 추가
        this.items.push(item);
    }

    // 게임 속도와 deltaTime,stage를  받아서 아이템을 업데이트
    update(gameSpeed, deltaTime, stage) {
        // nextInterval이 0 이하이면 새로운 아이템을 생성하고 다음 생성 시간을 설정
        if (this.nextInterval <= 0) {
            this.createItem(stage);
            this.setNextItemTime(); // 새로운 아이템 생성 시간을 랜덤하게 설정
        }

        // 아이템 생성 대기 시간 감소
        this.nextInterval -= deltaTime;

        // 모든 아이템의 상태를 업데이트 (아이템의 위치나 애니메이션 처리 등)
        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        // 화면 밖으로 나간 아이템을 items 배열에서 제거
        this.items = this.items.filter(item => item.x > -item.width);
    }

    // 아이템을 캔버스에 그리는 함수
    draw() {
        this.items.forEach((item) => item.draw());
    }

    // 아이템이 특정 스프라이트와 충돌했는지 체크하는 함수
    collideWith(sprite) {
        // 아이템 배열에서 충돌이 발생한 첫 번째 아이템을 찾음
        const collidedItem = this.items.find(item => item.collideWith(sprite))
        if (collidedItem) {
            // 충돌한 아이템을 화면에서 지움
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id // 충돌한 아이템의 ID 반환
            }
        }
    }

    // 아이템을 리셋하는 함수 (아이템 목록 초기화)
    reset() {
        this.items = [];
    }
}

export default ItemController;