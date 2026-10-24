import {ImageResponse} from 'next/og';

export const alt='Jaimin Jariwala — Software Engineer';
export const size={width:1200,height:630};
export const contentType='image/png';

export default function Image(){
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',background:'#f5f5f2',padding:32,fontFamily:'sans-serif',color:'#202020'}}>
      <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',background:'white',padding:'68px 64px',border:'2px solid #e7e7e2',borderRadius:28}}>
        <div style={{display:'flex',fontSize:24,color:'#72726e'}}>jaiminjariwala.netlify.app</div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'flex',fontSize:76,fontWeight:700,letterSpacing:-4}}>Jaimin Jariwala</div>
          <div style={{display:'flex',fontSize:36,color:'#666663'}}>Software Engineer</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16,fontSize:23}}>
          <div style={{width:20,height:20,background:'#2050eb',borderRadius:5}}/>
          <div style={{width:20,height:20,background:'#37af73',borderRadius:5}}/>
          <div style={{width:20,height:20,background:'#e63a3b',borderRadius:5}}/>
          <span style={{marginLeft:12}}>Desktop apps · Web experiences · Backend systems</span>
        </div>
      </div>
    </div>,size,
  );
}
