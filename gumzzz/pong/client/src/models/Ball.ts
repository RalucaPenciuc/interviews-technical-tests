export default interface Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  velocityX: number; // velocity = speed + direction
  velocityY: number;
}
