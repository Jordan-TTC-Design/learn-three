varying vec2 vUv;

float random(vec2 st){
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{   
    // 彩色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // 灰階漸層 ，都是用一樣的數值 vUv.x
    // gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);

    // Pattern 3
    // float strength = vUv.x;

    // Pattern 4
    // float strength = vUv.y;

    // Pattern 5 相反
    // float strength = 1.0 - vUv.y;

    // Pattern 6 相反急遽漸變
    // float strength = (1.0 - vUv.y) * 10.0;

    // Pattern 7
    float strength = mod(vUv.y * 10.0, 1.0);

    // Pattern 8
    // float strength = mod(vUv.y * 10.0, 1.0);

    // if (strength > 0.5) {
    //     strength = 1.0;
    // } else {
    //     strength = 0.0;
    // }

    // strength = step(0.5, strength);

    // Pattern 13
    // float strength = step(0.9, mod(vUv.y * 10.0, 1.0));
    // strength -= step(0.4, mod(vUv.x * 10.0, 1.0));

    // Pattern 14
    // float barx = step(0.9, mod(vUv.y * 10.0, 1.0));
    // barx *= step(0.4, mod(vUv.x * 10.0, 1.0));

    // float bary = step(0.9, mod(vUv.x * 10.0, 1.0));
    // bary *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barx + bary;

        // Pattern 15
    // float barx = step(0.8, mod(vUv.y * 10.0+0.2, 1.0));
    // barx *= step(0.4, mod(vUv.x * 10.0, 1.0));

    // float bary = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
    // bary *= step(0.4, mod(vUv.y * 10.0, 1.0));

    // float strength = barx + bary;

    // Pattern 16
    // float strength = abs( vUv.x - 0.5 );

    // Pattern 17
    // float strength = min( abs( vUv.x - 0.5 ), abs( vUv.y - 0.5 ));

    // Pattern 18
    // float strength = max( abs( vUv.x - 0.5 ), abs( vUv.y - 0.5 ));

    // Pattern 19
    // float strength = step(0.2 ,max( abs( vUv.x - 0.5 ), abs( vUv.y - 0.5 )));

    // Pattern 20
    // float strength1 = step(0.2 ,max( abs( vUv.x - 0.5 ), abs( vUv.y - 0.5 )));
    // float strength2 = 1.0 - step(0.25 ,max( abs( vUv.x - 0.5 ), abs( vUv.y - 0.5 )));
    // float strength = strength1 * strength2;

    // Pattern 21
    // float strength = floor(vUv.x * 10.0) / 10.0;

    // Pattern 22
    // float strength1 = floor(vUv.x * 10.0) / 10.0;
    // float strength2 = floor(vUv.y * 10.0) / 10.0;
    // float strength = strength1 * strength2;

    // Pattern 23

    // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
    // float strength = random(gridUv);

    // Pattern 26
    // float strength = length(vUv);

    // Pattern 27
    // float strength = length(vUv - 0.5);

    // Pattern 28
    // float strength = 0.02 / distance(vUv, vec2(0.5));
    gl_FragColor = vec4(strength, strength, strength, 1.0);
    
}