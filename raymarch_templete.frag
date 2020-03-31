#define MAX_STEP 1000
#define FAR_CLIP 10.0
#define NEAR_CLIP 0.0
#define RAY_EPSILON 10e-5
#define PI 3.14159

float sdPlane( vec3 p, vec4 n )
{
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}
float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}
float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}
float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}
float sdRoundedCylinder( vec3 p, float ra, float rb, float h )
{
  vec2 d = vec2( length(p.xz)-2.0*ra+rb, abs(p.y) - h );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0)) - rb;
}

vec2 opU(vec2 a, vec2 b) {
    return (a.x < b.x) ? a : b;
}

// distance equation
vec2 map(in vec3 p) {
    vec2 res = vec2(1e10, -1.0);
    res = opU(res, vec2(sdBox(p-vec3(0.0,0.0,0.0), vec3(0.3,0.5,0.2)), 1.0f));
    res = opU(res, vec2(sdSphere(p-vec3(-1.0,0.0,0.0), .4), 1.0f));
    res = opU(res, vec2(sdRoundedCylinder(p-vec3(1.0,0.0,0.0), 0.2, 0.2,0.5), 1.0f));
    return res;
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal(in vec3 p) {
    const vec2 h = vec2(10e-5,0);
    return normalize( vec3(map(p+h.xyy).x - map(p-h.xyy).x,
                           map(p+h.yxy).x - map(p-h.yxy).x,
                           map(p+h.yyx).x - map(p-h.yyx).x ) );
}

vec2 castRay(in vec3 ro, in vec3 rd) {
    float t = NEAR_CLIP; 
    vec2 res;
    for (int i = 0; i < MAX_STEP && t < FAR_CLIP; i++) {
        res = map(ro + t*rd);

        if (abs(res.x) < RAY_EPSILON) {
            return vec2(t,res.y);
        }

        t += res.x;
    }

    // not hit
    return vec2(-1.0, -1.0);
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr ){
    vec3 cw = normalize(ta-ro);
    vec3 cp = vec3(sin(cr), cos(cr),0.0); // rotation axis
    vec3 cu = normalize( cross(cw,cp) ); 
    vec3 cv = cross(cu,cw); // = cp
    return mat3( cu, cv, cw );  // TBN basis
}


vec3 render(in vec3 ro, in vec3 rd) {
    vec3 col = vec3(0.0);
    vec2 hit = castRay(ro,rd);
    float t = hit.x;
    float m = hit.y;
    vec3 p =  ro+ t*rd;
    // hit
    if (hit.y >= 0.0) {
        vec3 n = calcNormal(p);
        // bsdf
        col += n;
    }
    
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 mo = iMouse.xy/iResolution.xy;
   
    // camera
    vec3 ta = vec3(0,-0.2,0);
    vec3 ro = ta +  vec3(3.0 *cos(2.0 * PI * mo.x), 2.0*mo.y, 3.0*sin(2.0*PI * mo.x));
    mat3 c2w = setCamera(ro,ta, 0.0);
    
    // ray setting
    vec2 cp = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    vec3 rd = c2w * normalize( vec3(cp,2) );  // use camera z for fov
    
    // render
    vec3 col = vec3(0.0);
    col += render(ro,rd);

    // Hit
    fragColor = vec4(col, 1.0);
}