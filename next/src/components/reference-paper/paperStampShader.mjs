// Keep printed artwork on the bent material only. The DOM owns flat content;
// PaperPeel synchronizes its clipping in the appropriate direction so the
// incoming photo is already visible when the GPU curl recedes.
export function withSurfaceStamp(shader) {
  const changes = [
    ['let t=f32(ij.x)/256.0;', 'let t=clamp((f32(ij.x)-24.0)/232.0,0.0,1.0);'],
    ['if(ij.x==0u){distance=-2.0*p.pixelSize;}', 'if(ij.x<24u){distance=-extent*(1.0-f32(ij.x)/24.0);}else if(ij.x==24u){distance=-2.0*p.pixelSize;}'],
    ['if(p.rollAngle>0.0001){alpha*=clamp(materialDepth/p.pixelSize+0.5,0.0,1.0);}', `if(p.rollAngle>0.0001){
      if(materialDepth<0.0){
        discard;
      }else{alpha*=clamp(materialDepth/p.pixelSize+0.5,0.0,1.0);}
    }`],
  ];
  for(const [before,after] of changes){
    if(!shader.includes(before))throw new Error('Paper stamp shader source changed: '+before);
    shader=shader.replace(before,after);
  }
  // Absolute document pixels, not normalized to a changing article height.
  return shader.replaceAll('o.original/p.size','o.original/vec2f(textureDimensions(undersideInk))');
}
