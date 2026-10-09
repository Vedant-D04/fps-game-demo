/* Shared original arcade controller. Used by Node authority and browser prediction. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BBMovement=factory()})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const terrain=typeof require==='function'?require('./terrain'):globalThis.BBTerrain;
 const config={speed:4.5,maxSpeed:10.5,jump:7,gravity:23,step:1/120};
 const overlap=(p,x,y,w)=>x>w[0]-.3&&x<w[0]+w[2]+.3&&y>w[1]-.3&&y<w[1]+w[3]+.3;
 function reset(p){Object.assign(p,{vx:0,vy:0,height:0,verticalVelocity:0,crouch:0,sliding:false,slideTime:0,grounded:true,motionTime:0,nextJump:0,landed:false,duckHeld:false,jumpSerial:0,landSerial:0})}
 function eye(p){return 1.55-(p.crouch||0)*.55}
 function blocked(map,p,x,y){return !terrain.inside({...map,width:map.width||28,depth:map.depth||20},x,y)||terrain.surface(map,x,y)>(p.height||0)+.42||(map.propWalls||[]).some(w=>overlap(p,x,y,w)&&(p.height||0)<.75)||map.walls.some((w,i)=>overlap(p,x,y,w)&&(p.height||0)<(map.wallBases?.[i]||0)+(map.wallHeights?.[i]||3.6)-.001)}
 function floor(map,p){let h=terrain.surface(map,p.x,p.y);for(const w of map.propWalls||[])if(overlap(p,p.x,p.y,w)&&p.height>=.67)h=Math.max(h,.75);map.walls.forEach((w,i)=>{const top=(map.wallBases?.[i]||0)+(map.wallHeights?.[i]||3.6);if(overlap(p,p.x,p.y,w)&&p.height>=top-.08)h=Math.max(h,top)});return h}
 function step(map,p,input,dt){
 p.vx??=0;p.vy??=0;p.height??=0;p.verticalVelocity??=0;p.motionTime=(p.motionTime||0)+dt;
 const support=floor(map,p);let grounded=p.height<=support+.005&&p.verticalVelocity<=0;
 if(grounded){if(p.wasGrounded===false){p.landed=true;p.landSerial=(p.landSerial||0)+1}p.height=support;p.verticalVelocity=0}const duck=!!input.crouch;
 p.crouch=(p.crouch||0)+((duck?1:0)-(p.crouch||0))*(1-Math.exp(-dt*22));
 const oldSpeed=Math.hypot(p.vx,p.vy);
 if(grounded&&duck&&p.landed&&oldSpeed>3.5){const gain=Math.min(config.maxSpeed,oldSpeed+1.05)/oldSpeed;p.vx*=gain;p.vy*=gain;p.slideTime=.48}
 if(grounded&&duck&&!p.duckHeld&&oldSpeed>3.5)p.slideTime=.48;p.duckHeld=duck;p.landed=false;p.slideTime=Math.max(0,(p.slideTime||0)-dt);p.sliding=grounded&&duck&&p.slideTime>0&&Math.hypot(p.vx,p.vy)>2.7;
 if(grounded&&input.jump&&p.motionTime>=(p.nextJump||0)){p.verticalVelocity=config.jump;p.nextJump=p.motionTime+.15;grounded=false;p.jumpSerial=(p.jumpSerial||0)+1}
 const f=Math.max(-1,Math.min(1,Number(input.forward)||0)),s=Math.max(-1,Math.min(1,Number(input.strafe)||0));
 let dx=f*Math.cos(p.angle)-s*Math.sin(p.angle),dy=f*Math.sin(p.angle)+s*Math.cos(p.angle),len=Math.hypot(dx,dy);if(len){dx/=len;dy/=len}
 const diagonal=f&&s?1.12:1,wish=config.speed*diagonal*(grounded&&duck&&!p.sliding?.46:1)*(input.aim?.86:1);
 if(grounded&&!p.sliding){const speed=Math.hypot(p.vx,p.vy),drop=Math.max(1.2,speed)*10*dt,scale=speed?Math.max(0,speed-drop)/speed:0;p.vx*=scale;p.vy*=scale}
 if(len){const current=p.vx*dx+p.vy*dy,add=Math.max(0,wish-current),accel=Math.min(add,(grounded?(p.sliding?9:75):13)*dt);p.vx+=dx*accel;p.vy+=dy*accel}
 if(p.sliding){const decay=Math.exp(-dt*.55);p.vx*=decay;p.vy*=decay}
 const speed=Math.hypot(p.vx,p.vy);if(speed>config.maxSpeed){p.vx*=config.maxSpeed/speed;p.vy*=config.maxSpeed/speed}
 // Small substeps keep high-speed players from tunnelling through thin cover.
 const nx=p.x+p.vx*dt,ny=p.y+p.vy*dt;if(!blocked(map,p,nx,p.y))p.x=nx;else p.vx=0;if(!blocked(map,p,p.x,ny))p.y=ny;else p.vy=0;
 if(grounded&&map.terrain){const ground=terrain.surface(map,p.x,p.y);if(Math.abs(ground-p.height)<=.42)p.height=ground;}
 const before=p.height;if(!grounded){p.verticalVelocity-=config.gravity*dt;p.height+=p.verticalVelocity*dt;const top=floor(map,{...p,height:before});if(p.height<=top){p.height=top;p.verticalVelocity=0;p.landSerial=(p.landSerial||0)+1;p.landed=true;grounded=true}}
 // Stepping off cover begins falling immediately.
 if(grounded&&p.height>floor(map,p)+.01)grounded=false;
 p.grounded=grounded;p.wasGrounded=grounded;p.speed=Math.hypot(p.vx,p.vy);
 }
 function advance(map,p,input,dt){let remaining=Math.min(.12,Math.max(0,dt));while(remaining>1e-7){const delta=Math.min(config.step,remaining);step(map,p,input,delta);remaining-=delta}}
 return {config,reset,eye,blocked,advance};
});
