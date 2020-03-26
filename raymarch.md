notes based on articles by [Jamie Wang](http://jamie-wong.com/) and [Inigo Quilez](http://iquilezles.org/)

###  Simple Marching, Distance only
Ray setup
```
// (dist , material) <- ray oritation, direction 
vec2 castRay(vec3 ro, vec3 rd) {
    float t = NEAR_CLIP; 
    vec2 res;  // used for distance equation
    for (range(MAX_STEP) && t < FAR_CLIP) {
        res = map(ro + t*rd);

        // hit
        if (abs(res.x) < RAY_EPSILON) {
            return res;
        }

        t += res.x;
    }

    // not hit
    return vec2(-1.0, -1.0);
}
```
Standard sdf functions : [iq](http://iquilezles.org/www/articles/distfunctions/distfunctions.htm)

Define sdf on model origin, inverse translation on point p for world position.
```
// (dist, material) <- world position
vec2 map(vec3 p) {
    vec2 res = (RAY_EPSILON*0.1, -1.0);
    for all object with sdf s, material m {
        res = (res.x < s) ? res : vec2(s,m);
    }
    return res;
}
```

### Shadertoy Utils
```
// ray origin, tangent, 
mat3 setCamera( in vec3 ro, in vec3 ta, float cr ){
    vec3 cw = normalize(ta-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0);
    vec3 cu = normalize( cross(cw,cp) );
    vec3 cv = cross(cu,cw);
    return mat3( cu, cv, cw );
}
```