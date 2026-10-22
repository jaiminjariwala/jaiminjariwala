/* Third-party jm.sv public paper renderer. Local reference comparison only.
 * Source URLs and provenance: PORTFOLIO-V2.md. Review permissions before release. */
import math from './paperMath';
import {withSurfaceStamp} from './paperStampShader.mjs';
const moduleExports={};
const register=(items)=>{for(let i=0;i<items.length;i+=3)moduleExports[items[i]]=items[i+2];};
const e={s:register,i(id){if(id===798840)return math;if(id===786450)return {gpuPaperStore:{get:()=>math.GPU_PAPER_DEFAULTS}};if(id===27170)return {sitePaperSettings:settings=>settings};throw new Error('Unsupported reference module '+id);},A:()=>import('./gpuKernel').then(module=>module.default)};
"use strict";var t=e.i(798840);function a(){return{size:[0,0],viewport:[0,0,0,0],midpoint:[0,0],direction:[0,0],length:0,gu:0,bendGapCap:0,thicknessGu:0,curl:0,offset:0,lightX:0,bodyBounds:[0,0,0,0],scallops:[0,0,0,0],pixelSize:0,curlAngle:0,foldDistance:0,tipAngle:0,rollLength:0,rollAngle:0,rollPitch:.14,rollTilt:0,rollShade:0,surfaceShade:0,castShadowBlurGu:0,castShadowSpreadGu:0,castShadowDistanceGu:0,contactShadowStrength:0,contactShadowSoftnessGu:0,castShadowStrength:0,backFaceShade:0,backFacePosition:0,backFaceWidth:0,backFaceFalloff:0}}var i=e.i(786450);function l(e=t.COLORS,a=!1){let i=e.length,n=e.map(e=>`vec3f(${[1,3,5].map(t=>(parseInt(e.slice(t,t+2),16)/255).toFixed(6)).join(",")})`).join(","),r=i-1,o=`diagnostic(off, derivative_uniformity);
struct State { point: vec2f, velocity: vec2f }
struct Params { size: vec2f, midpoint: vec2f, direction: vec2f, length: f32, gu: f32, curl: f32, offset: f32, lightX: f32, viewport: vec4f, bodyBounds: vec4f, scallops: vec4f, pixelSize: f32, curlAngle: f32, surfaceShade: f32, contactShadowStrength: f32, contactShadowSoftnessGu: f32, castShadowStrength: f32, backFaceShade: f32, backFacePosition: f32, backFaceWidth: f32, backFaceFalloff: f32, foldDistance: f32, tipAngle: f32, castShadowBlurGu: f32, castShadowSpreadGu: f32, castShadowDistanceGu: f32, thicknessGu: f32, bendGapCap: f32, rollLength: f32, rollAngle: f32, rollShade: f32, rollTilt: f32, rollPitch: f32 }
@group(0) @binding(0) var<storage,read> states: array<State>;
@group(0) @binding(1) var<uniform> p:Params;
@group(0) @binding(4) var linear:sampler;
fn boxDistance(q:vec2f,lo:vec2f,hi:vec2f)->f32 {
 let d=max(lo-q,q-hi);return length(max(d,vec2f(0)))+min(max(d.x,d.y),0.0);
}
fn ellipseDistance(q:vec2f,r:vec2f)->f32 {
 let n=q/r;return (length(n)-1.0)*min(r.x,r.y);
}
fn silhouetteDistance(q:vec2f)->f32 {
 let amp=p.scallops.x;let side=p.scallops.y;let pitch=p.scallops.z;
 let lo=p.bodyBounds.xy;let hi=p.bodyBounds.zw;
 // Shared strip/body joins are interior, not silhouette edges.
 
 var distance=boxDistance(q,lo,hi);
 let outerLeft=lo.x-side;
 let cx=outerLeft+(floor((q.x-outerLeft)/pitch)+0.5)*pitch;
 let top=ellipseDistance(q-vec2f(cx,lo.y),vec2f(pitch*0.5,amp));
 let bottom=ellipseDistance(q-vec2f(cx,hi.y),vec2f(pitch*0.5,amp));
 var horizontal=boxDistance(q,vec2f(outerLeft,-1000000),vec2f(hi.x+side,1000000));
 // Full ellipses overlap the body. Clipping each to a half ellipse
 // creates a zero-distance internal seam that antialiasing makes translucent.
 distance=min(distance,max(top,horizontal));
 distance=min(distance,max(bottom,horizontal));
 if(side>0.0){
  let start=lo.y-amp;let sy=p.scallops.w;
  let cy=start+(floor((q.y-start)/sy)+0.5)*sy;
  let vertical=boxDistance(q,vec2f(-1000000,start),vec2f(1000000,hi.y+amp));
  distance=min(distance,max(ellipseDistance(q-vec2f(lo.x,cy),vec2f(amp,sy*0.5)),vertical));
  distance=min(distance,max(ellipseDistance(q-vec2f(hi.x,cy),vec2f(amp,sy*0.5)),vertical));
  distance=min(distance,max(length(q-lo)-amp,max(q.x-lo.x,q.y-lo.y)));
  distance=min(distance,max(length(q-vec2f(hi.x,lo.y))-amp,max(hi.x-q.x,q.y-lo.y)));
  distance=min(distance,max(length(q-vec2f(lo.x,hi.y))-amp,max(q.x-lo.x,hi.y-q.y)));
  distance=min(distance,max(length(q-hi)-amp,max(hi.x-q.x,hi.y-q.y)));
 }
 return distance;
}
fn coverage(q:vec2f)->f32 {
 let distance=silhouetteDistance(q);
 let aa=clamp(fwidth(distance),0.0001,p.pixelSize*2.0);
 return 1.0-smoothstep(-aa*0.5,aa*0.5,distance);
}
fn bending(uv:vec2f,layer:u32)->f32 {
 let grid=clamp(uv,vec2f(0),vec2f(1))*15.0;
 let cell=min(vec2u(floor(grid)),vec2u(14));let blend=fract(grid);
 let i=${i}u+layer*256u+cell.y*16u+cell.x;
 return mix(mix(states[i].point.x,states[i+1u].point.x,blend.x),mix(states[i+16u].point.x,states[i+17u].point.x,blend.x),blend.y);
}

// Shared spacing and bend equations, excluding flutter.
fn layerSpacing(depth:f32)->vec2f {
 let progress=clamp(depth/max(p.gu,p.foldDistance),0.0,1.0);
 let radius=max(p.gu*0.1,p.curl*p.gu);
 let taper=smoothstep(0.0,1.0,progress);
 let air=min(p.offset*p.gu*smoothstep(0.0,p.gu*20.0,p.length),radius*p.bendGapCap)*taper;
 let thickness=p.thicknessGu*p.gu*mix(0.15,1.0,taper);
 return vec2f(thickness,air);
}
fn rollPhase(depth:f32)->f32 {
 let t=clamp(depth/max(0.001,p.rollLength),0.0,1.0);
 return -log(1.0-(1.0-exp(-p.rollPitch*p.rollAngle))*t)/p.rollPitch;
}
fn attachmentAngle(t:f32)->f32 {return 1.57079633+1.57079633*smoothstep(0.0,1.0,t);}
fn attachmentPoint(distance:f32)->vec2f {
 if(p.rollAngle>0.0001){return vec2f(0);}
 let arc=max(p.gu*0.1,p.curl*p.gu)*p.curlAngle;
 let primary=min(distance,arc);var point=vec2f(0);
 for(var i=0u;i<16u;i++){
  let a=attachmentAngle(primary*(f32(i)+0.5)/16.0/arc);
  point+=vec2f(-cos(a),sin(a))*primary/16.0;
 }
 return point;
}
fn bendAngle(depth:f32)->f32 {
 let arc=max(p.gu*0.1,p.curl*p.gu)*p.curlAngle;
 if(p.rollAngle>0.0001){return rollPhase(depth);}
 let tail=max(0.0,p.foldDistance-arc-p.gu*2.0);
 let span=max(p.gu*0.01,tail*0.7);
 let start=arc+max(0.0,tail-span);
 let tip=p.tipAngle*smoothstep(0.0,p.gu*2.0,tail);
 return attachmentAngle(clamp(depth/arc,0.0,1.0))+tip*smoothstep(start,start+span,depth);
}
struct MeshOutput { @builtin(position) position:vec4f, @location(0) original:vec2f, @location(1) world:vec3f, @location(2) @interpolate(flat) layer:u32, @location(3) normal:vec3f }
@vertex fn vs_main(@builtin(vertex_index) id:u32,@builtin(instance_index) layer:u32)->MeshOutput {
 // A regular strip in material coordinates. Rolled poses distribute vertices
 // by winding angle; the resting profile retains its denser attachment grid.
 ${a?"let ij=vec2u(id%257u,id/257u);":"let corners=array<vec2u,6>(vec2u(0,0),vec2u(1,0),vec2u(0,1),vec2u(0,1),vec2u(1,0),vec2u(1,1));let cell=id/6u;let ij=vec2u(cell%256u,cell/256u)+corners[id%6u];"}
 let origin=p.midpoint-p.direction*p.length*0.5;
 let u=p.direction;let v=vec2f(-u.y,u.x);
 let midpoint=origin+u*p.foldDistance;let extent=length(p.size);
 let angle=p.curlAngle;let baseRadius=max(0.001,p.curl*p.gu);
 let gridArc=baseRadius*angle;
 var distance=f32(ij.x)/96.0*gridArc;
 if(ij.x>96u){distance=gridArc+f32(min(ij.x,224u)-96u)/128.0*max(p.gu,p.foldDistance-gridArc);}
 if(ij.x>224u){distance=max(gridArc+p.gu,p.foldDistance)+f32(ij.x-224u)/32.0*extent;}
 if(p.rollAngle>0.0001){
  let t=f32(ij.x)/256.0;
  // Uniform spiral angle concentrates vertices where the radius is smallest.
  let material=(1.0-exp(-p.rollPitch*p.rollAngle*t))/(1.0-exp(-p.rollPitch*p.rollAngle));
  distance=p.rollLength*material;
  // Raster support only: extend past the shared attachment so every layer
  // covers its edge samples. The fragment mask below defines the real edge.
  if(ij.x==0u){distance=-2.0*p.pixelSize;}
 }
 // Long articles made the old uniform cross-flap grid hundreds of pixels
 // wide. Concentrate samples around the grabbed corner without adding vertices.
 let cross=f32(ij.y)/64.0*2.0-1.0;
 let denseSpan=max(p.gu*8.0,p.foldDistance);
 let spread=log(1.0+extent/denseSpan);
 let tangent=sign(cross)*denseSpan*(exp(abs(cross)*spread)-1.0);
 let radius=baseRadius;
 let arc=radius*angle;
 // Smooth angle profiles have zero curvature at both ends. Integrating
 // unit tangents preserves material length and blends both bends without kinks.
 let grabTail=max(0.0,p.foldDistance-arc);
 let bendableTail=max(0.0,grabTail-p.gu*2.0);
 let tipSpan=max(p.gu*0.01,bendableTail*0.7);
 let tipStart=arc+max(0.0,bendableTail-tipSpan);
 let tipAngle=p.tipAngle*smoothstep(0.0,p.gu*2.0,bendableTail);
 // Integrate each bend separately. Sampling across the whole flap changed
 // the primary arc's approximation at every vertex, creating internal seams.
 let attachment=attachmentPoint(distance);
 var x=attachment.x;
 // Place the compressed flat stack above the receiver. The bottom sheet
 // remains at z=0 when the opened half-turn starts tangent to the page.
 var z=attachment.y+4.0*p.thicknessGu*p.gu*0.15*sin(1.57079633*smoothstep(0.0,0.5,p.rollAngle));
 let tip=min(max(0.0,distance-tipStart),tipSpan);
 if(p.rollAngle<=0.0001){
  for(var sample=0u;sample<16u;sample++){
   let fraction=(f32(sample)+0.5)/16.0;
   let b=angle+tipAngle*smoothstep(0.0,tipSpan,tip*fraction);
   x-=cos(b)*tip/16.0;z+=sin(b)*tip/16.0;
  }
 }
 let straight=max(0.0,min(distance,tipStart)-arc);
 if(p.rollAngle<=0.0001){x-=cos(angle)*straight;z+=sin(angle)*straight;}
 let remainder=max(0.0,distance-tipStart-tipSpan);
 if(p.rollAngle<=0.0001){x-=cos(angle+tipAngle)*remainder;z+=sin(angle+tipAngle)*remainder;}
 var theta=bendAngle(distance);
 if(p.rollAngle>0.0001){
  let k=p.rollPitch;let offset=f32(layer)*(p.thicknessGu+p.offset)*p.gu;
  var s=max(0.0,distance);
  for(var i=0u;i<8u;i++){
   let r=max(0.000001,radius-k*s);let a=-log(r/radius)/k;
   s=clamp(s-(s+offset*a-distance)/(1.0+offset/r),0.0,max(0.0,distance));
  }
  let q=max(0.00000001,1.0-k*s/radius);theta=-log(q)/k;
  let scale=radius/(1.0+k*k);
  x=-scale*(k*(1.0-q*cos(theta))+q*sin(theta))-offset*sin(theta);
  // All sheets meet the receiver at one contact point. A constant stack
  // lift here projects separated colored edges onto otherwise flat paper.
  let contactLift=smoothstep(0.0,p.gu*2.0,max(0.0,distance));
  z=scale*(1.0-q*cos(theta)-k*q*sin(theta))+(4.0*(p.thicknessGu+p.offset)*p.gu-offset*cos(theta))*contactLift;
 }
 // Smoothly droop the free material toward the receiver in world-space Z.
 // Shared by the visible mesh and its shadow mesh, never a screen offset.
 if(p.rollAngle>0.0001 && p.tipAngle>0.0 && distance>0.0){
  let tipProgress=smoothstep(p.foldDistance*0.5,max(p.gu,p.foldDistance),distance);
  z-=min(p.tipAngle*p.gu,max(0.0,z-p.gu*0.35))*tipProgress;
 }
 if(p.rollAngle>0.0001 && distance<0.0){
  x=-distance;z=0.0;theta=0.0;
 }
 let original=midpoint-u*distance+v*tangent;
 // Map the lifted material to the wave field using the curl-compensated
 // crease distance. The free tip must not land on the field's pinned rim.
 let waveSpan=max(p.gu*4.0,p.foldDistance*1.25);
 let uv=vec2f(tangent/max(p.length,1.0)+0.5,distance/waveSpan);
 let envelope=smoothstep(max(p.gu*2.0,p.foldDistance*0.55),max(p.gu*3.0,p.foldDistance*0.95),distance);
 // Pin only a fingertip-sized neighborhood, not a quarter of the flap.
 let pin=1.0-smoothstep(p.gu*2.0,p.gu*3.0,length(vec2f(tangent,distance-p.foldDistance)));
 // Fade displacement at the finger instead of subtracting its height from
 // nearby vertices, which created a deep local dent. Bound the local slope
 // so a high flutter amplitude cannot stretch the grabbed scallop.
 let grabDistance=length(vec2f(tangent,distance-p.foldDistance));
 // The 16x16 field stores height, not an inextensible cloth constraint.
 // Limit amplitude relative to its physical sample spacing, otherwise high
 // Flexibility creates steep slopes and visibly stretches the scallop mask.
 let sampleSpacing=min(max(p.length,1.0),waveSpan)/15.0;
 let waveLimit=min(grabDistance*0.15,sampleSpacing*0.2);
 let wave=clamp(bending(uv,layer)*envelope*(1.0-pin),-waveLimit,waveLimit);
 let normal=vec3f(u*sin(theta),cos(theta));
 // Fan the stack from the grabbed material point back to the attachment.
 // Normalizing by the actual crease distance gives both exposed edges the
 // same gradual taper, rather than a fixed-width band followed by full gap.
 // Close the air gap smoothly at the attachment without an extra squared
 // envelope that erased the exposed layers well before the perimeter.
 // Separation is one value for the whole stack, increasing with pull until
 // the configured gap is reached. A moving, per-vertex curvature clamp made
 // individual scallops alternately expand and collapse through the bend.
 // Allow the resting stack to open visibly without raising the configured
 // maximum gap. Keep a radius-relative cap on very tight bends.
 // The nominal paper weight stays fixed; the attached stack visually
 // compresses under contact, opening to full thickness at the free tip.
 let spacing=layerSpacing(distance);
 let thickness=spacing.x;
 let airGap=spacing.y;
 let separation=f32(layer)*(thickness+airGap);
 // Flutter may lag by layer, but cannot exceed its thickness interval.
 // A common displacement carries the stack; bounded residual motion keeps
 // each neighboring layer separated even when the free tip shakes rapidly.
 let commonWave=clamp(bending(uv,0u)*envelope*(1.0-pin),-waveLimit,waveLimit);
 let differentialLimit=spacing.y*0.2;
 let orderedWave=commonWave+clamp(wave-commonWave,-differentialLimit,differentialLimit);
 // Thickness keeps the layers ordered; a small material-edge stagger
 // exposes their colors without translating surfaces through each other.
 // Keep the original exposed-edge spacing.
 let edgeStagger=f32(layer)*airGap;
 let surfaceTangent=vec3f(-u*cos(theta),sin(theta));
 var world=vec3f(midpoint+u*x+v*tangent,z)+normal*(orderedWave-separation)-surfaceTangent*edgeStagger;
 if(p.rollAngle>0.0001){world=vec3f(midpoint+u*x+v*tangent,z);}
 // Tilt the view along the roll axis, exposing either end of the spiral.
 // Keep physical positions/normals for lighting, clearance and cast shadows.
 let viewed=world.xy-v*world.z*p.rollTilt;
 let clip=(viewed-p.viewport.zw)/p.viewport.xy;
 var o:MeshOutput;
 o.position=vec4f(clip.x*2.0-1.0,1.0-clip.y*2.0,clamp(0.8-world.z/max(1.0,extent)*0.5,0.001,0.999),1.0);
 o.original=original;o.world=world;o.layer=layer;
 // Smooth analytic cylinder normals; triangle derivatives made each
 // tessellation strip a separate lighting band.
 let step=1.0/15.0;
 let gradient=vec2f(bending(uv+vec2f(step,0),layer)-bending(uv-vec2f(step,0),layer),bending(uv+vec2f(0,step),layer)-bending(uv-vec2f(0,step),layer))/(2.0*step*max(p.length,1.0));
 o.normal=normalize(normal-vec3f(v,0)*gradient.x-vec3f(-u*cos(theta),sin(theta))*gradient.y);
 return o;
}
@fragment fn fs_main(o:MeshOutput)->@location(0) vec4f {
 var alpha=coverage(o.original);
 let origin=p.midpoint-p.direction*p.length*0.5;
 let u=p.direction;
 let materialDepth=dot(origin+u*p.foldDistance-o.original,u);
 if(p.rollAngle>0.0001){alpha*=clamp(materialDepth/p.pixelSize+0.5,0.0,1.0);}
 // The attached perimeter belongs to the stationary scalloped sheet.
 // Clip contact pixels there, then release this receiver mask as material
 // lifts away. The free flap retains its original material silhouette.
 let contactSpan=max(p.gu*0.5,p.thicknessGu*p.gu*4.0);
 if(materialDepth<=contactSpan){alpha=min(alpha,coverage(o.world.xy));}
 // Preserve the complete material silhouette, including perimeter contacts.
 // Normal-based fading would erase the nearly horizontal start of a roll.
 if(alpha<0.001){discard;}
 // Lighting follows the bent geometry, rather than painted gradient bands.
 let n=normalize(o.normal);
 let light=normalize(vec3f(-p.lightX,-0.7,select(1.5,1.0/max(0.001,p.castShadowDistanceGu),p.rollAngle>0.0001)));
 let arc=max(0.001,p.curl*p.gu)*p.curlAngle;
 let colors=array<vec3f,${i}>(${n});
 var surfaceColor=colors[o.layer];
 if(p.rollAngle>0.0001){
  // Broad diffuse illumination, normalized so the flat page stays white.
  // The same light vector also projects the receiver shadow.
  let viewDirection=normalize(vec3f(vec2f(-u.y,u.x)*p.rollTilt,1.0));
  let visibleNormal=n*select(-1.0,1.0,dot(n,viewDirection)>=0.0);
  let lighting=clamp((1.0-p.rollShade+p.rollShade*max(0.0,dot(visibleNormal,light)))/(1.0-p.rollShade+p.rollShade*light.z),0.0,1.0);
  surfaceColor*=lighting;
 }else{
  // Retain the production resting-peek appearance outside this experiment.
  let slope=sin(clamp(materialDepth/arc,0.0,1.0)*3.14159265);
  let shade=1.0-p.surfaceShade*(slope*slope*0.75+(1.0-abs(dot(n,light)))*0.25);
  let backT=(materialDepth/arc-p.backFacePosition)/max(0.01,p.backFaceWidth)+0.5;
  let backProfile=pow(max(0.0,sin(clamp(backT,0.0,1.0)*3.14159265)),p.backFaceFalloff);
  surfaceColor*=select(shade,1.0-p.backFaceShade*backProfile,o.layer==${r}u);
 }
 return vec4f(surfaceColor,alpha);
}
`,s=`
@group(0) @binding(0) var image:texture_2d<f32>;
@group(0) @binding(1) var linear:sampler;
struct O { @builtin(position) p:vec4f, @location(0) uv:vec2f }
@vertex fn vs_main(@builtin(vertex_index) i:u32)->O {let a=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));var o:O;o.p=vec4f(a[i],0,1);o.uv=vec2f((a[i].x+1.0)*0.5,(1.0-a[i].y)*0.5);return o;}
@fragment fn fs_main(o:O)->@location(0) vec4f{return textureSample(image,linear,o.uv);}
`,c=o.slice(0,o.indexOf("@fragment fn fs_main")).replace(" // A regular strip",` let layer=${r}u;
 // A regular strip`).replace("@builtin(instance_index) layer:u32","@builtin(instance_index) instance:u32").replace("let clip=(viewed-p.viewport.zw)/p.viewport.xy;","let projected=world.xy+vec2f(p.lightX,0.7)*max(0.0,world.z)*p.castShadowDistanceGu;let clip=(projected-p.viewport.zw)/p.viewport.xy;")+`
@fragment fn fs_main(o:MeshOutput)->@location(0) vec4f {
 // Use uniform caster strength through the entire crease, including
 // both scalloped contacts. Blur and receiver clipping shape the edge.
 var mask=coverage(o.original);
 let origin=p.midpoint-p.direction*p.length*0.5;
 let materialDepth=dot(origin+p.direction*p.foldDistance-o.original,p.direction);
 if(p.rollAngle>0.0001){mask*=clamp(materialDepth/p.pixelSize+0.5,0.0,1.0);}
 return vec4f(mask,mask,mask,mask);
}
`,p=o.slice(0,o.indexOf("struct MeshOutput"))+`
@group(0) @binding(2) var shadow:texture_2d<f32>;

struct ShadowOutput { @builtin(position) position:vec4f, @location(0) uv:vec2f }
@vertex fn vs_main(@builtin(vertex_index) i:u32)->ShadowOutput {
 let a=array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3));var o:ShadowOutput;
 o.position=vec4f(a[i],0,1);o.uv=vec2f((a[i].x+1.0)*0.5,(1.0-a[i].y)*0.5);return o;
}
@fragment fn fs_main(o:ShadowOutput)->@location(0) vec4f {
 let q=p.viewport.zw+o.uv*p.viewport.xy;
 let origin=p.midpoint-p.direction*p.length*0.5;
 let u=p.direction;
 let crease=origin+u*p.foldDistance;
 let creaseDistance=dot(q-crease,u);
 let receiverSide=1.0-smoothstep(-p.pixelSize,0.0,creaseDistance);
 // Evaluate derivative-based coverage before divergent control flow. The
 // final shadow is zero outside this receiver, so skip the 128-tap blur
 // there instead of evaluating it across the entire Retina viewport.
 let receiverCoverage=coverage(q);
 if(receiverSide==0.0 || receiverCoverage==0.0){return vec4f(0);}
 // Only the revealed bottom receiver gets a cast shadow.
 // A contact silhouette has no crease-plane cut: the opaque moving
 // surface hides its interior and leaves only the soft curved edge visible.
 // Dense samples overlap on the half-resolution mask; widely spaced
 // taps produced repeated silhouettes and visible diagonal bands.
 let pullDistance=p.length;
 let pullOpening=smoothstep(p.gu*2.0,p.gu*20.0,pullDistance);
 let softness=max(p.pixelSize,select(p.gu*(p.castShadowBlurGu+0.2+0.3*pullOpening),p.curl*p.gu*p.castShadowBlurGu,p.rollAngle>0.0001));
 let spread=p.gu*p.castShadowSpreadGu;
 let sampleRadius=spread+softness*1.414214;
 // The turned-over surface projects forward from the crease. Only flutter,
 // layer spacing and the light offset can move its caster behind that line.
 // Bound those excursions before blurring: automatic opening exposes most
 // of the viewport, but distant revealed paper cannot receive this shadow.
 // waveLimit <= length / 75; all layer offsets contribute normal spacing,
 // (normal spacing, tangent stagger, differential flutter) plus thickness.
 let casterReach=p.curl*p.gu*2.5*(1.0+p.castShadowDistanceGu*(abs(p.lightX)+0.7))+p.length/75.0+p.gu*(${(2*r+.2).toFixed(1)}*p.offset+${r.toFixed(1)}*p.thicknessGu+p.castShadowDistanceGu*(abs(p.lightX)+0.7));
 let contactReach=max(p.pixelSize*2.0,p.gu*p.contactShadowSoftnessGu*3.6875)*8.0;
 // Two CSS pixels cover the half-resolution caster's linear filter footprint.
 if(creaseDistance < -max(sampleRadius+casterReach+2.0,contactReach)){return vec4f(0);}
 var mask=0.0;var weight=0.0;
 // A square tap grid repeats a nearly straight crease at discrete offsets.
 // Golden-angle disk samples avoid coherent diagonal copies at wide spreads.
 for(var i=0u;i<128u;i++){
  let radius=sqrt((f32(i)+0.5)/128.0)*sampleRadius;
  let angle=f32(i)*2.39996323;
  let offset=vec2f(cos(angle),sin(angle))*radius;
  let w=exp(-pow(max(0.0,radius-spread)/softness,2.0)*1.2);
  mask+=textureSample(shadow,linear,o.uv+offset/p.viewport.xy).r*w;weight+=w;
 }
 let castStrength=p.castShadowStrength;
 // A blurred finite caster loses coverage at its endpoints. Anchor the
 // contact component to the crease instead, with uniform strength right
 // through both perimeter intersections. The receiver silhouette clips it.
 let creasePoint=q-u*creaseDistance;
 let contactWidth=max(p.pixelSize*2.0,p.gu*p.contactShadowSoftnessGu*3.6875);
 let endpointRoom=contactWidth*2.0;
 let onPaper=1.0-smoothstep(0.0,endpointRoom,silhouetteDistance(creasePoint));
 let contact=exp(-0.5*pow(creaseDistance/contactWidth,2.0))*onPaper;
 // The receiver exposed by this corner lies behind the crease along -u.
 // Both the cast silhouette and contact band belong to that side only.
 // Stack a faint broad cast shadow with a narrower continuous seam.
 // Both fall off smoothly across the crease, without raising endpoint
 // strength or adding another rendering pass.
 let seam=exp(-0.5*pow(creaseDistance/max(p.pixelSize,p.gu*p.contactShadowSoftnessGu),2.0))*onPaper;
 let broad=mask/weight*castStrength;
 // The rolled mesh already supplies a physical caster. A synthetic line
 // along the mathematical crease draws a phantom diagonal on flat paper.
 let contactShadow=select(p.contactShadowStrength*(contact*(0.008/0.03)+seam*(0.022/0.03)),0.0,p.rollAngle>0.0001);
 let shadow=(1.0-(1.0-broad)*(1.0-contactShadow))*receiverSide;
 return vec4f(0,0,0,shadow*receiverCoverage);
}
`,d=p.indexOf(" var mask=0.0;"),u=p.indexOf(" let castStrength="),h=p.slice(0,u).replace(" if(receiverSide==0.0 || receiverCoverage==0.0){return vec4f(0);}","")+" return vec4f(mask/weight);\n}\n",f=p.slice(0,d)+" let filteredMask=textureSampleLevel(shadow,linear,o.uv,0.0).r;\n"+p.slice(u).replace("let broad=mask/weight*castStrength;","let broad=filteredMask*castStrength;");return{PAPER_MESH:o,PRESENT:s,PAPER_SHADOW:c,SHADOW_COMPOSITE:p,SHADOW_BLUR:h,SHADOW_RESOLVE:f}}let{PAPER_MESH:n,PRESENT:r,PAPER_SHADOW:o,SHADOW_COMPOSITE:s}=l();function c(e=t.PAPER_LAYER_COUNT){return`
struct State { point: vec2f, velocity: vec2f }
struct Input { point: vec2f, dt: f32, damping: f32, coupling: f32, reset: f32, flexibility: f32 }
@group(0) @binding(0) var<storage,read> source: array<State>;
@group(0) @binding(1) var<storage,read_write> destination: array<State>;
@group(0) @binding(2) var<uniform> input: Input;
@compute @workgroup_size(64) fn cs_main(@builtin(global_invocation_id) id:vec3u) {
 if(id.x>=${257*e}u){return;}
 if(id.x>=${e}u){
  let field=(id.x-${e}u)/256u;let cell=(id.x-${e}u)%256u;let x=cell%16u;let y=cell/16u;
  var s=source[id.x];
  if(input.reset>0.5 || input.flexibility<0.001 || x==0u || x==15u || y==0u || y==15u){destination[id.x]=State(vec2f(0),vec2f(0));return;}
  let h=s.point.x;
  // y is distance along the pull; x runs parallel to the crease.
  // Propagate bending along the pull and keep cross-flap variation weak.
  let along=source[id.x-16u].point.x+source[id.x+16u].point.x-2.0*h;
  let across=source[id.x-1u].point.x+source[id.x+1u].point.x-2.0*h;
  let lap=along+across*0.08;
  // A small pinned height mesh. Neighbor coupling propagates bending waves;
  // pointer acceleration excites them, damping lets them come to rest.
  let motion=input.point-source[0u].point;
  let envelope=sin(f32(x)*3.14159265/15.0)*sin(f32(y)*3.14159265/15.0);
  // Excite both axes, including diagonal drags (x-y used to cancel).
  var forcing=0.0;
  if(field==0u){forcing=length(motion)*sin(f32(y)*0.6)*envelope*input.flexibility*110.0;}
  // Each lower sheet follows the preceding sheet's previous-frame field.
  // Separate state gives genuine temporal lag rather than a phase offset.
  var followHeight=0.0;
  if(field>0u){followHeight=source[id.x-256u].point.x*1.08;}
  let follow=select(35.0,130.0,field>0u);
  let decay=(7.0+input.damping*18.0)/(1.0+f32(field)*0.18);
  // Beyond 1, increase flutter without extrapolating stiffness below zero.
  let stiffness=mix(900.0,180.0,min(input.flexibility,1.0));
  s.velocity.x+=(lap*stiffness+(followHeight-h)*follow-s.velocity.x*decay+forcing)*input.dt;
  let maxFlutter=12.0*max(1.0,input.flexibility);
  s.point.x=clamp(s.point.x+s.velocity.x*input.dt,-maxFlutter,maxFlutter);
  destination[id.x]=s;return;
 }
 let frequency=52.0/max(1.0,f32(id.x)*(1.0+(0.94-input.coupling)*8.0));
 var s=source[id.x];
 if(input.reset>0.5 || id.x==0u){s=State(input.point,vec2f(0));}
 else {s.velocity+=(input.point-s.point)*frequency*frequency*input.dt-2.0*frequency*(input.damping/0.82)*s.velocity*input.dt;s.point+=s.velocity*input.dt;}
 destination[id.x]=s;
}`}c();var p=e.i(27170);async function d(n,r={}){let{init:o,storage:s,compute:u,draw:h,sampler:f,surface:g,frame:m,texture:v,target:x}=await e.A(898508),b=await o(),w=b.gpu.limits.maxTextureDimension2D,y=r.colors??t.COLORS,{PRESENT:S}=l(y);try{let e=(r.undersideInk||r.surfaceInk)?v(b,{kind:"2d",size:[1,1],format:"rgba8unorm",usage:["texture_binding","copy_dst","render_attachment"]}):void 0,o=g(b,n,{autoResize:!1,size:[1,1]}),d=x(b,{size:[1,1],depth:!0,msaa:4}),k=x(b,{size:[1,1],depth:!0}),A=x(b,{size:[1,1]}),z=h(b,{shader:r.focalBlur?S.replace("struct O {","struct Focal { blur:f32, start:f32, end:f32, unused:f32 }\n@group(0) @binding(2) var<uniform> focal:Focal;\nstruct O {").replace("return textureSample(image,linear,o.uv);","let dimensions=vec2f(textureDimensions(image));let radius=focal.blur*smoothstep(focal.start,focal.end,o.uv.y);var color=textureSampleLevel(image,linear,o.uv,0.0)*0.2;for(var i=0u;i<8u;i++){let angle=f32(i)*0.785398163;let delta=vec2f(cos(angle),sin(angle))*radius/dimensions;color+=textureSampleLevel(image,linear,o.uv+delta,0.0)*0.1;}return color;"):S,vertices:3,blend:{color:{src:"one",dst:"zero"}},depth:!1}),D=f(b,{magFilter:"linear",minFilter:"linear"}),P=a(),q=new Uint16Array(98304);for(let e=0,t=0;e<64;e++)for(let a=0;a<256;a++){let i=257*e+a,l=i+1,n=i+257,r=n+1;q[t++]=i,q[t++]=l,q[t++]=n,q[t++]=n,q[t++]=l,q[t++]=r}let G=b.gpu.createBuffer({size:q.byteLength,usage:24});b.gpu.queue.writeBuffer(G,0,q);let M={indexBuffer:G,indexFormat:"uint16",indexCount:q.length},F=e=>{let t=e.length,a=257*t,i=l(e,!0),n=h(b,{shader:i.PAPER_SHADOW,geometry:M,depth:{write:!0,compare:"less-equal"},blend:{color:{src:"one",dst:"zero"}}}),o=h(b,{shader:i.SHADOW_BLUR,vertices:3,depth:!1}),p=h(b,{shader:i.SHADOW_RESOLVE,vertices:3,depth:!1,blend:{color:{src:"src-alpha",dst:"one-minus-src-alpha"},alpha:{src:"one",dst:"one-minus-src-alpha"}}}),f=(r.undersideInk||r.surfaceInk)?i.PAPER_MESH.replace("struct MeshOutput {","@group(0) @binding(5) var undersideInk:texture_2d<f32>;\nstruct MeshOutput {").replace("let surfaceColor=","var surfaceColor=").replace("return vec4f(surfaceColor,alpha);",`if(o.layer==${r.surfaceInk?0:t-1}u${r.surfaceInk?" && dot(n,normalize(vec3f(vec2f(-u.y,u.x)*p.rollTilt,1.0)))>0.0":""}){let print=textureSampleLevel(undersideInk,linear,o.original/p.size,0.0);surfaceColor=mix(surfaceColor,print.rgb*surfaceColor,print.a);}return vec4f(surfaceColor,alpha);`):i.PAPER_MESH,g=h(b,{shader:r.surfaceInk?withSurfaceStamp(f):f,geometry:M,instances:t,blend:{color:{src:"src-alpha",dst:"one-minus-src-alpha"},alpha:{src:"one",dst:"one-minus-src-alpha"}},depth:{write:!0,compare:"less-equal"}}),m=[s(b,16*a),s(b,16*a)],v=u(b,c(t)),x=Promise.all([g.compile(d),n.compile(k),p.compile(d),o.compile(A)]);return{mesh:g,shadowMesh:n,shadowComposite:p,shadowBlur:o,buffers:m,simulation:v,groups:Math.ceil(a/64),ready:x}},O=new Map;for(let e of[y,...r.palettes??[]]){let t=e.join(",");O.has(t)||O.set(t,F(e))}await Promise.all(Array.from(O.values(),e=>e.ready));let T=O.get(y.join(",")),_=T.buffers,C={source:_[0],destination:_[1],input:{point:[0,0],dt:0,damping:0,flexibility:0,coupling:0,reset:0}},B={states:_[0],p:P,...e?{undersideInk:e,linear:D}:{}},R={states:_[0],p:P},L={states:_[0],p:P,shadow:k.color,linear:D},j={states:_[0],p:P,shadow:A.color,linear:D},W={image:d.color,linear:D,...r.focalBlur?{focal:{blur:0,start:0,end:1,unused:0}}:{}},$=[0,0],H=[0,0],E=0,I=0,N=NaN,U={target:k,clear:[0,0,0,0],clearDepth:1},X={target:A,clear:[0,0,0,0]},K={target:d,clear:[0,0,0,0],clearDepth:1},V={target:o,clear:[0,0,0,0]},Y=e=>{e.draw(T.shadowComposite),e.draw(T.mesh)},J=e=>{e.pass(U,T.shadowMesh),e.pass(X,T.shadowBlur),e.pass(K,Y),e.pass(V,z)},Q=0,Z=0,ee=Promise.resolve(),et=()=>{Q--},ea=0,ei=!0,el=!1,en=NaN,er=NaN,eo=0,es=0,ec=!1,ep=e=>{if(n.style.visibility=e?"visible":"hidden",r.embedded)return void r.onVisibility?.(e);e?document.documentElement.dataset.gpuPeeling="true":delete document.documentElement.dataset.gpuPeeling;let t=document.querySelector("[data-gpu-snapshot]");t&&(t.style.visibility=e?"hidden":"")},ed=b.onError(e=>{console.error("Paper GPU rendering failed",e),ec=!0,ep(!1)});return{updateUndersideInk(t){if(!e)return;(e.size[0]!==t.width||e.size[1]!==t.height)&&(e.dispose(),B.undersideInk=e=v(b,{kind:"2d",size:[t.width,t.height],format:"rgba8unorm",usage:["texture_binding","copy_dst","render_attachment"]}));let a=t.getContext("2d").getImageData(0,0,t.width,t.height);b.gpu.queue.writeTexture({texture:e.gpu},a.data,{bytesPerRow:4*t.width},[t.width,t.height])},get failed(){return ec},whenIdle:()=>ee,setColors(e){let t=O.get(e.join(","));return!!t&&(t===T||(T=t,ea=0,ei=!0,!0))},clear(){el=!1,Z=0,ep(!1),ei=!0},paint(e,l,s,c,u,h,f,g,v=performance.now()){if(ec)return;let{mesh:x,shadowMesh:y,shadowComposite:S,shadowBlur:D,buffers:q,simulation:G,groups:M}=T;es=v,(u!==en||h!==er)&&(eo=v+1200,en=u,er=h);let F=Math.hypot(u-s,h-c),O=void 0!==(r.settings?.()??i.gpuPaperStore.get()).rollRadiusGu;if(F<(O?1e-8:.5))return void this.clear();if(Z=Math.min(.1,Z+f),!r.embedded&&Q>=2)return;f=Z,Z=0;let _=!el;el=!0;let U=r.settings?.()??i.gpuPaperStore.get(),X=r.embedded?U:(0,p.sitePaperSettings)(U,innerWidth<640),K=window.devicePixelRatio||1,V=r.pixelRatio??(!r.embedded&&innerWidth<640?Math.min(K,2):K),Y=r.embedded?r.paddingPx??16*e.gu:0,ed=e.docW+2*Y,eu=r.embedded?e.docH+2*Y:(r.viewportHeight?.()??innerHeight),eh=Math.min(w/ed,w/eu),ef=Math.min(V,eh),eg=Math.min(.5,eh),em=r.embedded?-Y:scrollY;if(E!==ed&&(E=ed,n.style.width=`${ed}px`),I!==eu&&(I=eu,n.style.height=`${eu}px`),r.embedded&&N!==Y&&(N=Y,n.style.left=`${-Y}px`,n.style.top=`${-Y}px`),W.focal&&r.focalBlur){let t=r.focalBlur();W.focal.blur=t.blur*ef,W.focal.start=(Y+e.docH*t.position)/eu,W.focal.end=(Y+e.docH*(t.position+t.falloff))/eu,z.set(W)}let ev=C.input;ev.point[0]=u,ev.point[1]=h,ev.damping=X.damping,ev.flexibility=X.flexibility,ev.coupling=X.coupling;let ex=Math.max(1,Math.ceil(120*f));ev.dt=f/ex;for(let e=0;e<ex;e++)C.source=q[ea],C.destination=q[1-ea],ev.reset=ei||r.staticPose?1:0,G.set(C).dispatch(M),ea=1-ea,ei=!1;!function(e,i,l,n,r,o,s,c,p,d,u,h,f,g,m=a()){let v=Math.hypot(o-n,s-r),x=g?Math.min(i.peek,(e.docW-e.amp)/e.gu,(e.docH-e.amp)/e.gu):i.peek,b=(o-n)/v,w=(s-r)/v,y=(0,t.materialBeyondPaperGrab)(n,r,b,w,e),{radius:S,tipAngle:k,foldDistance:A,rollLength:z,rollAngle:D,rollPitch:P}=(0,t.solveBend)(v,e.gu,x,i,y),q=Math.PI;m.size[0]=e.docW,m.size[1]=e.docH,m.viewport[0]=c,m.viewport[1]=p,m.viewport[2]=d,m.viewport[3]=u,m.midpoint[0]=(n+o)/2,m.midpoint[1]=(r+s)/2,m.direction[0]=(o-n)/v,m.direction[1]=(s-r)/v,m.length=v,m.gu=e.gu,m.bendGapCap=i.bendGapCap,m.thicknessGu=i.thicknessGu,m.curl=S/e.gu,m.offset=i.layerGapGu??l,m.lightX=h,m.bodyBounds[0]=e.left,m.bodyBounds[1]=e.top,m.bodyBounds[2]=e.right,m.bodyBounds[3]=e.docH-e.amp,m.scallops[0]=e.amp,m.scallops[1]=e.sideAmp,m.scallops[2]=g?e.period:(e.right-e.left+2*e.sideAmp)/Math.max(1,Math.round((e.right-e.left+2*e.sideAmp)/e.period)),m.scallops[3]=g?e.period:(e.docH-e.top+e.amp)/Math.max(1,Math.round((e.docH-e.top+e.amp)/e.period)),m.pixelSize=1/f,m.curlAngle=q,m.foldDistance=A,m.tipAngle=D>0.0001?(i.tipDropGu??0):k,m.rollLength=z,m.rollAngle=D,m.rollPitch=P,m.rollTilt=(0,t.rollViewShear)(i.rollTiltDeg),m.rollShade=i.rollShade??.14,m.surfaceShade=i.surfaceShade,m.castShadowBlurGu=i.castShadowBlurGu,m.castShadowSpreadGu=i.castShadowSpreadGu,m.castShadowDistanceGu=i.castShadowDistanceGu,m.contactShadowStrength=i.contactShadowStrength,m.contactShadowSoftnessGu=i.contactShadowSoftnessGu,m.castShadowStrength=i.castShadowStrength,m.backFaceShade=i.backFaceShade,m.backFacePosition=i.backFacePosition,m.backFaceWidth=i.backFaceWidth,m.backFaceFalloff=i.backFaceFalloff}(e,X,l.stackCornerOffsetGu,s,c,u,h,ed,eu,-Y,em,g,ef,!!r.embedded,P),B.states=q[ea],R.states=q[ea],j.states=q[ea],L.states=q[ea],x.set(B),y.set(R);let eb=Math.max(1,Math.min(w,Math.ceil(ed*eg))),ew=Math.max(1,Math.min(w,Math.ceil(eu*eg)));(H[0]!==eb||H[1]!==ew)&&(H[0]=eb,H[1]=ew,k.resize(H),A.resize(H),L.shadow=k.color,j.shadow=A.color),D.set(L),S.set(j);let ey=Math.max(1,Math.min(w,Math.round(ed*ef))),eS=Math.max(1,Math.min(w,Math.round(eu*ef)));($[0]!==ey||$[1]!==eS)&&($[0]=ey,$[1]=eS,d.resize($),o.resize($),W.image=d.color,z.set(W));let ek=m(b,J);ee=ek.done,r.embedded||(Q++,ek.done.then(et)),_&&ep(!0)},get active(){return el},get settling(){return es<eo},dispose(){this.clear(),ed(),e?.dispose(),G.destroy(),o.dispose(),b.dispose()}}}catch(e){throw b.dispose(),e}}e.s(["createPageEngine",0,d],926268)
export const createPageEngine=moduleExports.createPageEngine;
