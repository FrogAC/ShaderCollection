notes based on articles by [Jamie Wang](http://jamie-wong.com/) and [Inigo Quilez](http://iquilezles.org/)

##  Marching
We need: a ray util + an sdf function map(p) and any point p.
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
[Standard sdf functions](http://iquilezles.org/www/articles/distfunctions/distfunctions.htm)

Define sdf on model origin, inverse translation on point p for world position.
```
// (dist, material) <- world position
vec2 map(vec3 p) {
    vec2 res = (RAY_EPSILON*0.1, -1.0);
    for all object with sdf s, material m {
        res = (res.x < s) ? res : vec2(s,m);  // union sdf
    }
    return res;
}
```
#### Camera

Define the camera on a shpere's tangent plane. Camera_to_world mat can be calculated given ray orientation and camera position. Changing basis on tangent plane for tilt. image z-dist gives angle.

## Render

### Surface Normal

#### Sdf Gradients

Partial derivatices on sdf. Central difference require 6 DEs; Forward difference need 3.

#### Tetrahedron

Derived [here](http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm). In short, using Tetrahedron we only need 4 sdfs for 

### Lightning

Same BSDF

### Shadow

Marching shadow ray from pos to light. Min angle gives soft shadow range.