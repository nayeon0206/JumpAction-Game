// Item 클래스 정의
class Item {
    // 생성자: 아이템의 속성을 초기화
    constructor(ctx, id, x, y, width, height, image) {
        this.ctx = ctx;  // 캔버스 컨텍스트(ctx) - 아이템을 그리기 위한 컨텍스트
        this.id = id;  // 아이템의 고유 ID
        this.x = x;  // 아이템의 x 좌표
        this.y = y;  // 아이템의 y 좌표
        this.width = width;  // 아이템의 너비
        this.height = height;  // 아이템의 높이
        this.image = image;  // 아이템의 이미지 (이미지 객체)
    }

    // 아이템의 위치 업데이트: 아이템을 왼쪽으로 이동
    update(speed, gameSpeed, deltaTime, scaleRatio) {
        // 아이템을 속도, 게임 속도, 시간 차이, 스케일 비율에 따라 이동시킴
        this.x -= speed * gameSpeed * deltaTime * scaleRatio;  // x 좌표 감소 (아이템이 왼쪽으로 이동)
    }

    // 아이템 그리기: 캔버스에 아이템을 그림
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);  // 아이템의 이미지를 x, y 위치에 너비와 높이를 지정해 그린다.
    }

    // 아이템과 다른 스프라이트(캐릭터 등)와의 충돌 여부를 확인하는 메서드
    collideWith = (sprite) => {
        const adjustBy = 1.4;  // 충돌 판정에 사용할 조정 비율 (아이템 크기를 약간 줄여 충돌 범위를 늘림)
        
        // 충돌 판정 계산 (아이템과 스프라이트가 겹치는지 확인)
        const result = (
            this.x < sprite.x + sprite.width / adjustBy &&  // 아이템의 오른쪽이 스프라이트의 왼쪽을 넘어가지 않으면
            this.x + this.width / adjustBy > sprite.x &&  // 아이템의 왼쪽이 스프라이트의 오른쪽을 넘어가지 않으면
            this.y < sprite.y + sprite.height / adjustBy &&  // 아이템의 아래쪽이 스프라이트의 위쪽을 넘어가지 않으면
            this.y + this.height / adjustBy > sprite.y  // 아이템의 위쪽이 스프라이트의 아래쪽을 넘어가지 않으면
        );

        // 충돌이 발생한 경우, 아이템의 크기를 0으로 설정 (아이템이 사라짐)
        if (result) {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
        }

        // 충돌 결과 반환 (충돌하면 true, 아니면 false)
        return result;
    }
}


export default Item