// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
attribute float aRandom;
// attribute vec2 uv;

varying float vRandom; // 由於是varying，所以可以傳到 fragment shader，否則 fragment shader 無法取得 attribute 的值
varying vec2 vUv;
varying float vElevation;

void main()
{
  // gl_Position 已經存在
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);


  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.06;

  modelPosition.z += elevation;
  // modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
  // modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;
  // modelPosition.z += aRandom * 0.1;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
  // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  // gl_Position.y = 0.8;

  // vRandom = aRandom;
  vUv = uv;
  vElevation = elevation;
}