(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BBRecoil=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const tuning={rifle:{kick:.014,max:.11,recovery:.42,spread:.0015},smg:{kick:.009,max:.085,recovery:.32,spread:.0025},marksman:{kick:.025,max:.07,recovery:.55,spread:.0006},shotgun:{kick:.04,max:.08,recovery:.6,spread:.009}};
 function reset(p){p.recoilPitch=0;p.recoilYaw=0;p.sprayCount=0;p.recoilLast=0;p.recoilSide=1;p.recoilWeapon=null;}
 function update(p,weapon,now,dt){const t=tuning[weapon]||tuning.rifle;if(p.recoilWeapon&&p.recoilWeapon!==weapon)reset(p);if(now-(p.recoilLast||0)>170){const factor=Math.exp(-dt*12);p.recoilPitch=(p.recoilPitch||0)*factor;p.recoilYaw=(p.recoilYaw||0)*factor;}if(now-(p.recoilLast||0)>t.recovery*1000&&(p.recoilPitch||0)<.003){p.sprayCount=0;p.recoilPitch=0;p.recoilYaw=0;}}
 function fire(p,weapon,now,aim=false,random=Math.random){const t=tuning[weapon]||tuning.rifle;if(!p.recoilWeapon||p.recoilWeapon!==weapon)reset(p);p.recoilWeapon=weapon;const count=p.sprayCount||0,speed=Math.hypot(p.vx||0,p.vy||0),moving=Math.min(1,speed/4.5),air=p.grounded===false;const spread=(t.spread+Math.min(.014,count*.0012)+moving*.018+(air?.035:0))*(aim?.7:1)*(p.crouch>.5&&speed<.5?.8:1);const radius=Math.sqrt(random())*spread,theta=random()*Math.PI*2;
 const direction={...p,angle:p.angle+(p.recoilYaw||0)+Math.cos(theta)*radius,pitch:Math.max(-1.45,Math.min(1.45,(p.pitch||0)+(p.recoilPitch||0)+Math.sin(theta)*radius))};
 p.sprayCount=count+1;p.recoilLast=now;const control=(aim?.85:1)*(p.crouch>.5&&speed<.5?.85:1);p.recoilPitch=Math.min(t.max,(p.recoilPitch||0)+t.kick*control*(1+moving*.3));if(count>=5){if(random()<.25)p.recoilSide=-(p.recoilSide||1);p.recoilYaw=Math.max(-.045,Math.min(.045,(p.recoilYaw||0)+(p.recoilSide||1)*.005*control));}return direction;
 }
 return {reset,update,fire,tuning};
});
