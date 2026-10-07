const weapons={rifle:{name:'AR-24',damage:34,headDamage:100,interval:150,range:40,cost:0},smg:{name:'Vector-9',damage:20,headDamage:50,interval:85,range:24,cost:200},marksman:{name:'Longbow',damage:60,headDamage:100,interval:850,range:65,cost:350},shotgun:{name:'Breach-12',damage:70,headDamage:100,interval:700,range:7,cost:250}};
const captureSeconds=25;
const movement=require('./public/movement');
const recoil=require('./public/recoil');

const maps=[
{name:'Copper Harbor',theme:'harbor',walls:[[6,2,1,4],[6,2,6,1],[11,2,1,3],[12,7,1.5,1],[16,12,1.5,1],[17,18,6,1],[22,13,1,6],[17,17,1,2],[5,13,3,1],[20,6,3,1]],wallHeights:[3.6,3.6,3.6,.85,.85,3.6,3.6,3.6,.85,.85]},
{name:'Neon Garden',theme:'garden',walls:[[5,2,1,5],[5,2,7,1],[11,2,1,3],[16,17,7,1],[22,13,1,5],[16,16,1,2],[12,8,1,.8],[15,11,1,.8],[5,14,4,.7],[19,5,4,.7]],wallHeights:[3.8,3.8,3.8,3.8,3.8,3.8,.8,.8,.8,.8]}
];
// Extra lane cover uses the same geometry for server hits, movement and rendering.
maps[0].walls.push([8,10.8,1.6,.65],[18.4,8.55,1.6,.65],[10.5,12.3,.65,2],[16.85,5.7,.65,2]);maps[0].wallHeights.push(.9,.9,2.5,2.5);
maps[1].walls.push([8,11.8,2,.65],[18,7.55,2,.65],[9.8,6.3,.65,1.5],[17.55,12.2,.65,1.5]);maps[1].wallHeights.push(.85,.85,2.8,2.8);
// Three connected routes: old town, central market, and southern quay.
for(const [i,map] of maps.entries()){
 map.width=64;map.depth=44;map.spawns=[{x:3,y:10},{x:60,y:34}];map.botSpawns=[{x:34,y:10},{x:47,y:23},{x:59,y:34}];
 const add=(x,z,w,d,h)=>{map.walls.push([x,z,w,d]);map.wallHeights.push(h)};
 const buildings=i===0?[[30,3,9,8],[45,3,10,8],[33,17,8,7],[49,16,9,8],[6,26,10,8],[22,28,9,8],[39,31,9,8]]:[[29,3,7,10],[43,3,12,7],[32,19,8,6],[49,16,8,11],[5,27,11,7],[23,29,8,9],[40,32,9,7]];
 for(const [x,z,w,d] of buildings){add(x,z,w,1,4.8);add(x,z,1,d,4.8);add(x+w-1,z,1,d,4.8);add(x,z+d-1,w*.35,1,4.8);add(x+w*.65,z+d-1,w*.35,1,4.8)}
 for(const [x,z,w,d,h] of [[29,13,3,1,.85],[43,13,2,1,.85],[57,11,1,3,1.1],[26,23,4,1,.9],[43,27,3,1,.85],[17,35,1,4,2.6],[34,37,1,3,.8],[55,32,3,1,.9],[11,22,4,1,.85]])add(x,z,w,d,h);
 // Climbable steps and a broad platform overlooking the market.
 add(43,19,2,2,.35);add(43,21,2,2,.7);add(43,23,2,2,1.05);add(41,25,6,2,1.4);
 map.districts=i===0?[{name:'MARKET',x:34.5,z:11.025,y:3.7},{name:'SHIPYARD',x:50,z:11.025,y:3.7},{name:'QUAY',x:26.5,z:36.025,y:3.7}]:[{name:'ARCADE',x:32.5,z:13.025,y:3.7},{name:'ATRIUM',x:49,z:10.025,y:3.7},{name:'GREENHOUSE',x:27,z:38.025,y:3.7}];
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function blocked(r,x,y){return x<.4||y<.4||x>(maps[r.map].width||28)-.4||y>(maps[r.map].depth||20)-.4||(maps[r.map].propWalls||[]).some(([a,b,w,h])=>x>a-.3&&x<a+w+.3&&y>b-.3&&y<b+h+.3)||maps[r.map].walls.some(([a,b,w,h])=>x>a-.3&&x<a+w+.3&&y>b-.3&&y<b+h+.3)}

const props=[{x:3,y:3,prop:'lamp'},{x:25,y:17,prop:'lamp'},{x:8,y:7,prop:'lamp'},{x:20,y:13,prop:'lamp'},{x:3.8,y:16,prop:'barrel'},{x:24,y:4,prop:'barrel'},{x:11,y:16.5,prop:'crate'},{x:18,y:3.5,prop:'crate'}];
for(const map of maps){map.props=props;map.propWalls=props.filter(p=>p.prop!=='lamp').map(p=>[p.x-(p.prop==='crate'?.35:.24),p.y-(p.prop==='crate'?.35:.24),p.prop==='crate'?.7:.48,p.prop==='crate'?.7:.48]);}
// Ray geometry is exact; movement alone uses a clearance margin.
function rayBox(o,d,min,max,range=Infinity){let near=0,far=range;for(let i=0;i<3;i++){if(Math.abs(d[i])<1e-8){if(o[i]<min[i]||o[i]>max[i])return Infinity;continue}let a=(min[i]-o[i])/d[i],b=(max[i]-o[i])/d[i];if(a>b)[a,b]=[b,a];near=Math.max(near,a);far=Math.min(far,b);if(near>far)return Infinity}return near}
function obstruction(r,o,d,range){let distance=range;maps[r.map].walls.forEach(([x,z,w,h],i)=>{distance=Math.min(distance,rayBox(o,d,[x,0,z],[x+w,maps[r.map].wallHeights?.[i]||2.7,z+h],range))});for(const [x,z,w,depth]of maps[r.map].propWalls||[])distance=Math.min(distance,rayBox(o,d,[x,0,z],[x+w,.75,z+depth],range));return distance}
function traceShot(r,p,targets,gun){const cp=Math.cos(p.pitch||0),o=[p.x,(p.height||0)+movement.eye(p),p.y],d=[Math.cos(p.angle)*cp,Math.sin(p.pitch||0),Math.sin(p.angle)*cp];let distance=obstruction(r,o,d,gun.range),target=null,zone=null;
 for(const q of targets){if(q.hp<=0)continue;const h=q.height||0,scale=1-(q.crouch||0)*.3,yaw=q.angle??Math.PI/2,sy=Math.sin(yaw),cy=Math.cos(yaw),dx=o[0]-q.x,dz=o[2]-q.y,localOrigin=[dx*sy-dz*cy,o[1]-h,dx*cy+dz*sy],localDirection=[d[0]*sy-d[2]*cy,d[1],d[0]*cy+d[2]*sy];const boxes=[['head',-.2,.2,1.58,1.86,-.2,.23],['body',-.25,.25,.88,1.58,-.24,.27],['limb',-.265,.265,.08,.88,-.2,.22],['limb',-.46,-.25,.95,1.48,-.15,.42],['limb',.25,.46,.95,1.48,-.15,.42]];
 for(const [part,x0,x1,y0,y1,z0,z1]of boxes){const t=rayBox(localOrigin,localDirection,[x0,y0*scale,z0],[x1,y1*scale,z1],distance);if(t<distance){distance=t;target=q;zone=part}}}
 return {target,zone,from:o,to:o.map((v,i)=>v+d[i]*distance),damage:zone==='head'?gun.headDamage:zone==='limb'?Math.round(gun.damage*.65):gun.damage};}

function addTracer(r,shot){r.tracers??=[];const now=Date.now();r.tracers=r.tracers.filter(t=>now-t.at<400);r.tracers.push({id:now+'-'+Math.random(),at:now,from:shot.from,to:shot.to,hit:!!shot.target,head:shot.zone==='head',zone:shot.zone});r.tracers=r.tracers.slice(-32)}
function visible(r,a,b){const o=[a.x,(a.height||0)+movement.eye(a),a.y],v=[b.x-a.x,(b.height||0)+movement.eye(b)-o[1],b.y-a.y],length=Math.hypot(...v);return obstruction(r,o,v.map(x=>x/length),length)>=length}
function move(r,p,forward,strafe,dt,speed=3.2){let dx=forward*Math.cos(p.angle)-strafe*Math.sin(p.angle),dy=forward*Math.sin(p.angle)+strafe*Math.cos(p.angle);const len=Math.max(1,Math.hypot(dx,dy));dx=dx/len*speed*dt;dy=dy/len*speed*dt;if(!blocked(r,p.x+dx,p.y))p.x+=dx;if(!blocked(r,p.x,p.y+dy))p.y+=dy}
function jumpPhysics(p,jump,dt){p.height??=0;p.verticalVelocity??=0;if(jump&&!p.jumpHeld&&p.height===0)p.verticalVelocity=6;p.jumpHeld=!!jump;if(p.verticalVelocity!==0||p.height>0){p.verticalVelocity-=18*dt;p.height+=p.verticalVelocity*dt;if(p.height<=0){p.height=0;p.verticalVelocity=0}}}
const magazine={rifle:30,smg:36,marksman:8,shotgun:6};
function combatInit(p,weapon='rifle'){recoil.reset(p);p.shield=50;p.ammo=magazine[weapon];p.reloadUntil=0;p.lastDamageAt=0}
function combatUpdate(p,weapon,now,dt,reload){recoil.update(p,weapon,now,dt);const cap=magazine[weapon]||30;if(p.ammo==null)p.ammo=cap;if(p.reloadUntil&&now>=p.reloadUntil){p.ammo=cap;p.reloadUntil=0}if((reload||p.ammo===0)&&!p.reloadUntil&&p.ammo<cap)p.reloadUntil=now+(weapon==='shotgun'?2400:1800);if(p.hp>0&&now-(p.lastDamageAt||0)>5000)p.shield=Math.min(50,(p.shield||0)+dt*12)}
function damage(p,amount,now){const absorbed=Math.min(p.shield||0,amount);p.shield=Math.max(0,(p.shield||0)-absorbed);p.hp=Math.max(0,p.hp-(amount-absorbed));p.lastDamageAt=now;p.shieldHitUntil=absorbed?now+180:0;return absorbed}
module.exports={recoil,magazine,combatInit,combatUpdate,damage,rayBox,traceShot,addTracer,jumpPhysics,clamp,weapons,maps,blocked,captureSeconds,props,visible,move};
