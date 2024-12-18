// Cactus 클래스 정의
class Cactus {
  // 생성자: 클래스 인스턴스를 만들 때 호출되는 함수
  constructor(ctx, x, y, width, height, image) {
    // ctx: 캔버스의 2D 컨텍스트 객체 (이미지를 그리기 위해 필요)
    // x: 선인장의 x 좌표 (캔버스 내 위치)
    // y: 선인장의 y 좌표 (캔버스 내 위치)
    // width: 선인장의 너비
    // height: 선인장의 높이
    // image: 선인장의 이미지 객체 (이미지를 그리기 위해 사용)
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
  }

  // update 함수: 매 프레임마다 호출되어 선인장의 위치를 업데이트하는 함수
  update(speed, gameSpeed, deltaTime, scaleRatio) {
    // speed: 선인장이 이동하는 기본 속도
    // gameSpeed: 게임의 속도 (게임이 빨라지거나 느려지면 이 값이 바뀔 수 있음)
    // deltaTime: 한 프레임의 시간 간격 (이 값을 이용해 프레임 간의 속도를 일정하게 유지)
    // scaleRatio: 게임 화면 크기에 맞게 조정된 비율 (화면 크기나 해상도에 따라 다를 수 있음)
    
    // 선인장의 x 좌표를 이동시킴 (속도와 게임 속도에 비례하여 움직임)
    this.x -= speed * gameSpeed * deltaTime * scaleRatio;
  }

  // draw 함수: 선인장을 그리는 함수
  draw() {
    // ctx.drawImage를 사용하여 선인장의 이미지를 캔버스에 그린다
    // this.image: 선인장의 이미지 객체
    // this.x, this.y: 선인장의 위치
    // this.width, this.height: 선인장의 크기
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  // collideWith 함수: 다른 스프라이트와 충돌을 감지하는 함수
  collideWith(sprite) {
    const adjustBy = 1.4; // 충돌 검사 시 조금 여유를 두기 위한 비율 (충돌 범위를 약간 넓혀줌)

    // 충돌 감지: 선인장의 좌표와 다른 스프라이트의 좌표가 겹치는지 확인
    return (
      // 선인장의 왼쪽이 다른 스프라이트의 오른쪽보다 왼쪽에 있고,
      // 선인장의 오른쪽이 다른 스프라이트의 왼쪽보다 오른쪽에 있으며,
      // 선인장의 위쪽이 다른 스프라이트의 아래쪽보다 위쪽에 있고,
      // 선인장의 아래쪽이 다른 스프라이트의 위쪽보다 아래쪽에 있으면 충돌
      this.x < sprite.x + sprite.width / adjustBy && 
      this.x + this.width / adjustBy > sprite.x && 
      this.y < sprite.y + sprite.height / adjustBy && 
      this.y + this.height / adjustBy > sprite.y
    );
  }
}


export default Cactus;
