// Animación de la bahía de Cartagena (cielo, skyline, grúas, barcos, agua) para la landing.
// Es el mismo dibujo del index.html original, encapsulado: recibe el canvas y una
// función que dice si el tema es claro, y devuelve una función para detenerla.
export function iniciarEscenaPuerto(C, esClaro) {
  const X = C.getContext('2d');
  let W, H, t = 0, raf = 0;
  let isLight = esClaro();

  function resize(){W=C.width=innerWidth;H=C.height=innerHeight;}
  resize();addEventListener('resize',resize);
  function rnd(a,b){return a+Math.random()*(b-a);}

  // === PALETAS ===
  function pal(dark,light){ return isLight?light:dark; }

  // === SKY ===
  function drawSky(){
    let g=X.createLinearGradient(0,0,0,H*0.55);
    if(isLight){
      g.addColorStop(0,'#4a9fd4');
      g.addColorStop(0.3,'#6ab8e8');
      g.addColorStop(0.7,'#8ecfef');
      g.addColorStop(1,'#b8e2f5');
    } else {
      g.addColorStop(0,'#010810');
      g.addColorStop(0.3,'#041620');
      g.addColorStop(0.6,'#082030');
      g.addColorStop(0.85,'#0c2a3a');
      g.addColorStop(1,'#102838');
    }
    X.fillStyle=g;X.fillRect(0,0,W,H*0.55);
  }

  // === STARS (solo noche) ===
  const stars=Array.from({length:220},()=>({x:rnd(0,1),y:rnd(0,0.45),s:rnd(0.3,1.8),b:rnd(0.3,1),sp:rnd(0.3,1.5)}));
  function drawStars(){
    if(isLight)return;
    stars.forEach(s=>{
      let flicker=0.5+0.5*Math.sin(t*s.sp+s.x*100);
      X.globalAlpha=s.b*flicker*0.8;
      X.fillStyle='#c8e8ff';
      X.beginPath();X.arc(s.x*W,s.y*H,s.s,0,Math.PI*2);X.fill();
    });
    X.globalAlpha=1;
  }

  // === SOL / LUNA ===
  function drawCelestial(){
    if(isLight){
      // Sol
      let sx=W*0.15,sy=H*0.12,sr=36;
      let glow=X.createRadialGradient(sx,sy,sr*0.2,sx,sy,sr*5);
      glow.addColorStop(0,'rgba(255,240,150,0.35)');
      glow.addColorStop(1,'rgba(255,220,80,0)');
      X.fillStyle=glow;X.beginPath();X.arc(sx,sy,sr*5,0,Math.PI*2);X.fill();
      let sg=X.createRadialGradient(sx-4,sy-4,0,sx,sy,sr);
      sg.addColorStop(0,'#fff8c0');
      sg.addColorStop(0.5,'#ffe866');
      sg.addColorStop(1,'#ffcc00');
      X.fillStyle=sg;X.beginPath();X.arc(sx,sy,sr,0,Math.PI*2);X.fill();
    } else {
      // Luna
      let mx=W*0.15,my=H*0.12,mr=28;
      let g=X.createRadialGradient(mx,my,mr*0.2,mx,my,mr*4);
      g.addColorStop(0,'rgba(200,230,255,0.15)');g.addColorStop(1,'rgba(0,30,60,0)');
      X.fillStyle=g;X.beginPath();X.arc(mx,my,mr*4,0,Math.PI*2);X.fill();
      let g2=X.createRadialGradient(mx-4,my-3,0,mx,my,mr);
      g2.addColorStop(0,'#eef8ff');g2.addColorStop(0.5,'#c0d8e8');g2.addColorStop(1,'#8ab0c8');
      X.fillStyle=g2;X.beginPath();X.arc(mx,my,mr,0,Math.PI*2);X.fill();
    }
  }

  // === CLOUDS ===
  const clouds=Array.from({length:6},()=>({x:rnd(-0.1,1.1),y:rnd(0.05,0.3),w:rnd(120,300),h:rnd(15,35),sp:rnd(0.02,0.06),a:rnd(0.03,0.08)}));
  function drawClouds(){
    clouds.forEach(c=>{
      c.x+=c.sp*0.0003;if(c.x>1.3)c.x=-0.2;
      X.globalAlpha=isLight?c.a*4:c.a;
      X.fillStyle=isLight?'#ffffff':'#2a4a5e';
      let cx=c.x*W,cy=c.y*H;
      X.beginPath();X.ellipse(cx,cy,c.w,c.h,0,0,Math.PI*2);X.fill();
      X.beginPath();X.ellipse(cx-c.w*0.3,cy+5,c.w*0.5,c.h*0.7,0,0,Math.PI*2);X.fill();
      X.beginPath();X.ellipse(cx+c.w*0.35,cy+3,c.w*0.4,c.h*0.6,0,0,Math.PI*2);X.fill();
    });
    X.globalAlpha=1;
  }

  // === BUILDINGS ===
  const buildings=[];
  (function generateBuildings(){
    let bx=0;
    while(bx<1.05){
      let bw=rnd(0.015,0.045),bh=rnd(0.08,0.32);
      let type=Math.random();
      if(type<0.2){bw=rnd(0.008,0.018);bh=rnd(0.22,0.38);}
      else if(type<0.5){bw=rnd(0.03,0.06);bh=rnd(0.06,0.14);}
      let windows=[];
      let cols=Math.floor(bw*W/8),rows=Math.floor(bh*H/12);
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        windows.push({r,c,on:Math.random()>0.35,phase:rnd(0,100),speed:rnd(0.0003,0.002)});
      }
      let hue=rnd(190,220),sat=rnd(10,30),lit=rnd(12,22);
      buildings.push({x:bx,w:bw,h:bh,windows,hue,sat,lit,
        antenna:bh>0.2&&Math.random()>0.5,antennaH:rnd(0.01,0.03)});
      bx+=bw+rnd(0.002,0.012);
    }
  })();

  function drawBuildings(){
    let horizonY=H*0.52;
    buildings.forEach(b=>{
      let bx=b.x*W,bw=b.w*W,bh=b.h*H;
      let by=horizonY-bh;
      let litBase=isLight?b.lit+30:b.lit;
      let satBase=isLight?b.sat+10:b.sat;
      let bg=X.createLinearGradient(bx,by,bx,horizonY);
      bg.addColorStop(0,`hsl(${b.hue},${satBase}%,${litBase+5}%)`);
      bg.addColorStop(1,`hsl(${b.hue},${satBase}%,${litBase-3}%)`);
      X.fillStyle=bg;
      X.fillRect(bx,by,bw,bh);
      X.strokeStyle=`hsla(${b.hue},${satBase+20}%,${litBase+15}%,0.2)`;
      X.lineWidth=0.5;X.strokeRect(bx,by,bw,bh);
      // ventanas — solo de noche
      if(!isLight){
        let cols=Math.floor(bw/8),rows=Math.floor(bh/12);
        if(cols<1)cols=1;if(rows<1)rows=1;
        let ww=Math.max(2,(bw-4)/cols*0.6),wh=Math.max(2,8*0.6);
        let padX=(bw-(cols*(ww+2)))/2+1,padY=6;
        b.windows.forEach(win=>{
          if(win.r>=rows||win.c>=cols)return;
          let cycle=Math.sin(t*win.speed+win.phase);
          let isOn=win.on?(cycle>-0.7):false;
          if(isOn){
            let bright=0.4+0.3*((cycle+0.7)/1.7);
            let colors=['#ffeebb','#ffe8a0','#c8e0ff','#fff5d0'];
            X.fillStyle=colors[Math.floor(win.phase)%colors.length];
            X.globalAlpha=bright;
            let wx=bx+padX+win.c*(ww+2),wy=by+padY+win.r*(wh+4);
            X.fillRect(wx,wy,ww,wh);
            X.globalAlpha=bright*0.15;X.fillRect(wx-1,wy-1,ww+2,wh+2);
          }
        });
      } else {
        // De día: ventanas reflectivas azules
        let cols=Math.floor(bw/8),rows=Math.floor(bh/12);
        if(cols<1)cols=1;if(rows<1)rows=1;
        let ww=Math.max(2,(bw-4)/cols*0.6),wh=Math.max(2,8*0.6);
        let padX=(bw-(cols*(ww+2)))/2+1,padY=6;
        b.windows.forEach(win=>{
          if(win.r>=rows||win.c>=cols)return;
          X.fillStyle='#a8d4f0';
          X.globalAlpha=0.35;
          let wx=bx+padX+win.c*(ww+2),wy=by+padY+win.r*(wh+4);
          X.fillRect(wx,wy,ww,wh);
        });
      }
      X.globalAlpha=1;
      if(b.antenna){
        let ax=bx+bw/2,ay=by,ah=b.antennaH*H;
        X.strokeStyle=isLight?'#7a9aaa':'#3a6a7a';X.lineWidth=1;
        X.beginPath();X.moveTo(ax,ay);X.lineTo(ax,ay-ah);X.stroke();
      }
    });
  }

  // === CRANES ===
  const cranes=[
    {x:0.38,h:0.28,boomLen:0.12,trolleyPos:0.3,trolleyDir:1,trolleySpeed:rnd(0.0002,0.0005)},
    {x:0.44,h:0.30,boomLen:0.14,trolleyPos:0.6,trolleyDir:-1,trolleySpeed:rnd(0.0002,0.0005)},
    {x:0.50,h:0.26,boomLen:0.11,trolleyPos:0.5,trolleyDir:1,trolleySpeed:rnd(0.0002,0.0005)},
    {x:0.55,h:0.29,boomLen:0.13,trolleyPos:0.2,trolleyDir:-1,trolleySpeed:rnd(0.0002,0.0005)},
  ];
  function drawCranes(){
    let horizonY=H*0.52;
    cranes.forEach(cr=>{
      let cx=cr.x*W,ch=cr.h*H,boomL=cr.boomLen*W;
      let baseY=horizonY,topY=baseY-ch;
      let legW=12;
      let craneColor=isLight?'#3a6a8a':'#1a4a5a';
      let machineColor=isLight?'#4a7a9a':'#1a3848';
      let boomColor=isLight?'#5a8aaa':'#2a6878';
      X.strokeStyle=craneColor;X.lineWidth=3;
      X.beginPath();X.moveTo(cx-legW,baseY);X.lineTo(cx-4,topY);X.stroke();
      X.beginPath();X.moveTo(cx+legW,baseY);X.lineTo(cx+4,topY);X.stroke();
      X.fillStyle=machineColor;X.fillRect(cx-10,topY,20,12);
      X.strokeStyle=boomColor;X.lineWidth=2.5;
      X.beginPath();X.moveTo(cx,topY);X.lineTo(cx+boomL,topY-15);X.stroke();
      X.beginPath();X.moveTo(cx,topY);X.lineTo(cx-boomL*0.3,topY-10);X.stroke();
      cr.trolleyPos+=cr.trolleyDir*cr.trolleySpeed;
      if(cr.trolleyPos>0.95||cr.trolleyPos<0.05)cr.trolleyDir*=-1;
      let tx=cx+boomL*cr.trolleyPos,ty=topY-15*cr.trolleyPos+2;
      X.fillStyle=isLight?'#5aaaca':'#3a8898';X.fillRect(tx-3,ty-2,6,4);
      X.strokeStyle=isLight?'#4a7a9a':'#2a5868';X.lineWidth=0.8;
      let cableLen=20+cr.trolleyPos*15;
      X.beginPath();X.moveTo(tx,ty+2);X.lineTo(tx,ty+cableLen);X.stroke();
      X.fillStyle='#e86030';X.fillRect(tx-5,ty+cableLen,10,3);
      if(!isLight){
        let blink=Math.sin(t*0.004+cr.x*20)>0.3;
        if(blink){
          X.fillStyle='#ff4020';X.globalAlpha=0.9;
          X.beginPath();X.arc(cx,topY-2,2.5,0,Math.PI*2);X.fill();
          X.globalAlpha=0.15;X.beginPath();X.arc(cx,topY-2,10,0,Math.PI*2);X.fill();
          X.globalAlpha=1;
        }
      }
      X.fillStyle=isLight?'#2090c0':'#40c8ff';X.globalAlpha=0.5;
      X.fillRect(cx-legW-2,baseY-3,4,2);X.fillRect(cx+legW-2,baseY-3,4,2);
      X.globalAlpha=1;
    });
  }

  // === SHIPS ===
  const ships=[
    {x:0.15,y:0.58,len:100,speed:0.00005,dir:1,hullColor:'#1a2a38',superColor:'#2a3a4a'},
    {x:0.85,y:0.61,len:120,speed:0.00004,dir:-1,hullColor:'#1a2838',superColor:'#2a3848'},
    {x:0.50,y:0.55,len:75,speed:0.00003,dir:1,hullColor:'#1a2a3a',superColor:'#2a3a48'},
    {x:0.35,y:0.68,len:60,speed:0.00002,dir:-1,hullColor:'#182838',superColor:'#283848'},
    {x:0.70,y:0.74,len:50,speed:0.00003,dir:1,hullColor:'#1a2a36',superColor:'#2a3a46'},
  ];
  const wakeParticles=[];
  function drawShips(){
    let horizonY=H*0.52;
    ships.forEach(sh=>{
      sh.x+=sh.speed*sh.dir;
      if(sh.x>1.15)sh.x=-0.15;if(sh.x<-0.15)sh.x=1.15;
      let sx=sh.x*W,sy=horizonY+sh.y*H*0.25;
      let len=sh.len,hw=len*0.12;
      let hullC=isLight?'#2a4a6a':sh.hullColor;
      let superC=isLight?'#3a6080':sh.superColor;
      X.fillStyle=hullC;
      X.beginPath();
      X.moveTo(sx-len/2,sy);X.lineTo(sx-len/2+8,sy+hw);
      X.lineTo(sx+len/2-5,sy+hw);X.lineTo(sx+len/2+10,sy);
      X.closePath();X.fill();
      X.strokeStyle='#c03020';X.lineWidth=1.5;
      X.beginPath();X.moveTo(sx-len/2+5,sy+hw*0.7);X.lineTo(sx+len/2+5,sy+hw*0.7);X.stroke();
      let colors=['#c04030','#3070c0','#d0a020','#308040','#d06020'];
      let cw=8,ch=5,rows=2,cols=Math.floor(len*0.6/cw);
      for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
        X.fillStyle=colors[(r*cols+c)%colors.length];
        X.globalAlpha=isLight?0.9:0.7;
        X.fillRect(sx-len*0.28+c*cw,sy-ch*r-ch+2,cw-1,ch-1);
      }
      X.globalAlpha=1;
      let ssx=sx+len*0.3;
      X.fillStyle=superC;X.fillRect(ssx,sy-18,14,18);
      X.fillStyle=isLight?'#5a8aaa':'#3a5a6a';X.fillRect(ssx+2,sy-16,10,5);
      X.fillStyle=isLight?'#aad4f0':'#ffe880';X.globalAlpha=0.6;X.fillRect(ssx+3,sy-15,8,3);
      X.globalAlpha=1;
      X.strokeStyle=isLight?'#6a8aaa':'#4a6a7a';X.lineWidth=1;
      X.beginPath();X.moveTo(ssx+7,sy-18);X.lineTo(ssx+7,sy-28);X.stroke();
      X.fillStyle='#00ff60';X.globalAlpha=0.8;
      X.beginPath();X.arc(sx-len/2+3,sy-2,1.5,0,Math.PI*2);X.fill();
      X.fillStyle='#ff2020';
      X.beginPath();X.arc(sx+len/2+8,sy-2,1.5,0,Math.PI*2);X.fill();
      X.globalAlpha=1;
      if(Math.random()>0.85){
        wakeParticles.push({x:ssx+7,y:sy-28,vx:rnd(-0.2,0.2),vy:rnd(-0.5,-0.2),life:1,size:rnd(2,5)});
      }
    });
    for(let i=wakeParticles.length-1;i>=0;i--){
      let p=wakeParticles[i];
      p.x+=p.vx;p.y+=p.vy;p.life-=0.008;p.size+=0.03;
      if(p.life<=0){wakeParticles.splice(i,1);continue;}
      X.globalAlpha=p.life*0.3;
      X.fillStyle=isLight?'#8aaabb':'#5a7a8a';
      X.beginPath();X.arc(p.x,p.y,p.size,0,Math.PI*2);X.fill();
    }
    X.globalAlpha=1;
  }

  // === BUOYS ===
  const buoys=[{x:0.32,y:0.66},{x:0.58,y:0.72},{x:0.75,y:0.63}];
  function drawBuoys(){
    let horizonY=H*0.52;
    buoys.forEach(b=>{
      let bx=b.x*W,by=horizonY+(b.y-0.5)*H*0.8;
      let bob=Math.sin(t*0.002+b.x*30)*3;by+=bob;
      X.fillStyle='#d04030';X.beginPath();X.arc(bx,by,4,0,Math.PI*2);X.fill();
      X.fillStyle='#e06050';X.beginPath();X.arc(bx-1,by-1,1.5,0,Math.PI*2);X.fill();
      let blink=Math.sin(t*0.005+b.x*40)>0.7;
      if(blink){
        X.fillStyle='#ffff60';X.globalAlpha=0.9;
        X.beginPath();X.arc(bx,by-5,2,0,Math.PI*2);X.fill();
        X.globalAlpha=0.15;X.beginPath();X.arc(bx,by-5,8,0,Math.PI*2);X.fill();
        X.globalAlpha=1;
      }
    });
  }

  // === WATER ===
  function drawWater(){
    let horizonY=H*0.52;
    let wg=X.createLinearGradient(0,horizonY,0,H);
    if(isLight){
      wg.addColorStop(0,'#4ab0d8');wg.addColorStop(0.3,'#38a0c8');
      wg.addColorStop(0.7,'#2888b0');wg.addColorStop(1,'#1a6890');
    } else {
      wg.addColorStop(0,'#041820');wg.addColorStop(0.3,'#031218');
      wg.addColorStop(0.7,'#020c12');wg.addColorStop(1,'#010810');
    }
    X.fillStyle=wg;X.fillRect(0,horizonY,W,H-horizonY);

    for(let layer=0;layer<4;layer++){
      let freq=0.008+layer*0.004,amp=1.5-layer*0.3,yOff=horizonY+layer*((H-horizonY)/4);
      X.strokeStyle=isLight
        ?`rgba(255,255,255,${0.15-layer*0.03})`
        :`rgba(30,90,120,${0.12-layer*0.025})`;
      X.lineWidth=0.6;
      X.beginPath();
      for(let x=0;x<W;x+=3){
        let y=yOff+Math.sin(x*freq+t*0.001+layer*2)*amp+Math.sin(x*0.015+t*0.0007)*amp*0.6;
        x===0?X.moveTo(x,y):X.lineTo(x,y);
      }
      X.stroke();
    }

    // Reflejos
    if(!isLight){
      buildings.forEach(b=>{
        let bx=b.x*W,bw=b.w*W;
        let litWindows=b.windows.filter(w=>w.on&&Math.sin(t*w.speed+w.phase)>-0.7);
        if(litWindows.length===0)return;
        let refX=bx+bw/2,refStartY=horizonY+5,refLen=Math.min(b.h*H*0.6,80);
        let rg=X.createLinearGradient(refX,refStartY,refX,refStartY+refLen);
        rg.addColorStop(0,'rgba(255,235,170,0.12)');rg.addColorStop(1,'rgba(255,235,170,0)');
        X.fillStyle=rg;
        for(let dy=0;dy<refLen;dy+=2){
          let wobble=Math.sin(dy*0.1+t*0.002+b.x*20)*3;
          X.globalAlpha=0.08*(1-dy/refLen);
          X.fillRect(refX+wobble-2,refStartY+dy,4,2);
        }
        X.globalAlpha=1;
      });
    } else {
      // Reflejos de sol en el agua
      for(let i=0;i<20;i++){
        let sx=rnd(0,W*0.4),sy=horizonY+rnd(10,80);
        let shimmer=Math.sin(t*0.003+sx*0.01)*0.5+0.5;
        if(shimmer>0.5){
          X.globalAlpha=(shimmer-0.5)*0.3;
          X.fillStyle='#ffffff';
          X.fillRect(sx,sy,rnd(15,40),0.8);
        }
      }
    }
    X.globalAlpha=1;
  }

  // === HAZE ===
  function drawHaze(){
    let horizonY=H*0.52;
    let hg=X.createLinearGradient(0,horizonY-60,0,horizonY+20);
    if(isLight){
      hg.addColorStop(0,'rgba(100,180,220,0)');
      hg.addColorStop(0.5,'rgba(180,220,240,0.2)');
      hg.addColorStop(1,'rgba(150,200,230,0.1)');
    } else {
      hg.addColorStop(0,'rgba(15,40,60,0)');
      hg.addColorStop(0.5,'rgba(20,50,70,0.25)');
      hg.addColorStop(1,'rgba(15,35,50,0.1)');
    }
    X.fillStyle=hg;X.fillRect(0,horizonY-60,W,80);
  }

  // === PLANES ===
  const planes=[
    {x:-0.1,y:0.08,speed:0.00012,dir:1,phase:0},
    {x:1.15,y:0.15,speed:0.00009,dir:-1,phase:50},
    {x:0.3,y:0.05,speed:0.00007,dir:1,phase:120},
  ];
  function drawPlanes(){
    planes.forEach(p=>{
      p.x+=p.speed*p.dir;
      if(p.dir>0&&p.x>1.25)p.x=-0.15;
      if(p.dir<0&&p.x<-0.15)p.x=1.25;
      let px=p.x*W,py=p.y*H;
      let sz=p.y<0.1?6:9;
      let alpha=isLight?(p.y<0.1?0.5:0.7):(p.y<0.1?0.3:0.5);
      X.fillStyle=isLight?'#8aaabb':'#6a8a9a';X.globalAlpha=alpha;
      X.beginPath();X.ellipse(px,py,sz,sz*0.25,0,0,Math.PI*2);X.fill();
      let blink=Math.sin(t*0.008+p.phase)>0.4;
      X.globalAlpha=blink?0.9:0.3;
      let wingSpan=sz*0.8;
      X.fillStyle=p.dir>0?'#ff2020':'#00ff40';
      X.beginPath();X.arc(px-wingSpan*p.dir,py,1.2,0,Math.PI*2);X.fill();
      X.fillStyle=p.dir>0?'#00ff40':'#ff2020';
      X.beginPath();X.arc(px+wingSpan*p.dir,py,1.2,0,Math.PI*2);X.fill();
      X.globalAlpha=1;
      let trailDir=-p.dir;
      X.strokeStyle=isLight?'rgba(200,220,240,0.15)':'rgba(150,180,200,0.05)';
      X.lineWidth=1.2;
      X.beginPath();X.moveTo(px+10*trailDir,py);X.lineTo(px+90*trailDir,py+1.5*trailDir);X.stroke();
    });
  }

  // === RENDER ===
  function render(){
    isLight=esClaro();
    t++;
    X.clearRect(0,0,W,H);
    drawSky();
    drawStars();
    drawCelestial();
    drawClouds();
    drawPlanes();
    drawHaze();
    drawBuildings();
    drawCranes();
    drawWater();
    drawShips();
    drawBuoys();
    raf=requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', resize);
  };
}
