// Escena animada de un Incoterm: fábrica, puerto de origen, barco, puerto de destino
// y almacén, con la bandera que marca dónde pasa el riesgo del vendedor al comprador.
// drawScene dibuja un cuadro para el progreso t (0..1) y devuelve el texto de la etapa.
export function drawScene(ctx, W, H, t, inc) {
  const tc = Math.min(t, 1);
  const isLight = document.documentElement.classList.contains('light-mode');
  ctx.clearRect(0, 0, W, H);

  // Cielo degradado
  const sky = ctx.createLinearGradient(0,0,0,H*0.65);
  sky.addColorStop(0, isLight ? '#87CEEB' : '#050d1a');
  sky.addColorStop(1, isLight ? '#E0F6FF' : '#0a1628');
  ctx.fillStyle = sky;
  ctx.fillRect(0,0,W,H*0.65);

  // Mar
  const sea = ctx.createLinearGradient(0,H*0.55,0,H*0.75);
  sea.addColorStop(0, isLight ? '#4FA4C7' : '#0a2040');
  sea.addColorStop(1, isLight ? '#2D7593' : '#061428');
  ctx.fillStyle = sea;
  ctx.fillRect(0,H*0.55,W,H*0.2);

  // Olas animadas
  drawWaves(ctx, W, H, t, isLight);

  // Suelo
  const ground = ctx.createLinearGradient(0,H*0.72,0,H);
  ground.addColorStop(0, isLight ? '#D0D5DB' : '#111827');
  ground.addColorStop(1, isLight ? '#B8C0C9' : '#0d0d13');
  ctx.fillStyle = ground;
  ctx.fillRect(0,H*0.72,W,H*0.28);

  // Carretera
  ctx.fillStyle = isLight ? '#9CA3AF' : '#1a1f2e';
  ctx.fillRect(0,H*0.73,W,H*0.05);
  // líneas carretera
  ctx.strokeStyle = isLight ? '#F3F4F6' : '#374151'; 
  ctx.lineWidth=1.5; ctx.setLineDash([18,14]);
  ctx.beginPath(); ctx.moveTo(0,H*0.755); ctx.lineTo(W,H*0.755); ctx.stroke();
  ctx.setLineDash([]);

  // Posiciones fijas
  const fabX  = W*0.06;
  const portOX = W*0.30;
  const midX   = W*0.50;
  const portDX = W*0.70;
  const almX   = W*0.94;
  const groundY = H*0.73;
  const seaY    = H*0.62;

  // Edificios
  drawFabrica(ctx, fabX, groundY, H, isLight ? '#2563EB' : '#1e3a5f', 'VENDEDOR', isLight);
  drawAlmacen(ctx, almX, groundY, H, isLight ? '#DC2626' : '#3a1a1a', 'COMPRADOR', isLight);
  drawPuerto(ctx, portOX, groundY, H, isLight ? '#10B981' : '#1a2e1f', 'Puerto\nOrigen', isLight);
  drawPuerto(ctx, portDX, groundY, H, isLight ? '#F59E0B' : '#2e1a1a', 'Puerto\nDestino', isLight);

  // Ruta en el suelo
  drawRoad(ctx, fabX+30, portOX-10, groundY-2, tc, inc.vendedorHasta, 0, 0.30, isLight);
  drawRoad(ctx, portDX+10, almX-30, groundY-2, tc, inc.vendedorHasta, 0.70, 1.0, isLight);

  // Ruta marítima
  drawSeaRoute(ctx, portOX+10, portDX-10, seaY, tc, inc.vendedorHasta, 0.30, 0.70, isLight);

  // Camión (tierra)
  if(tc < 0.30) {
    const cx = lerp(fabX+35, portOX-15, tc/0.30);
    drawTruck(ctx, cx, groundY-2, false, isLight);
  }
  if(tc > 0.70 && tc < 1.0) {
    const cx = lerp(portDX+15, almX-35, (tc-0.70)/0.30);
    drawTruck(ctx, cx, groundY-2, false, isLight);
  }

  // Barco
  if(tc >= 0.28 && tc <= 0.72) {
    const bx = lerp(portOX+20, portDX-20, (tc-0.28)/0.44);
    drawShip(ctx, bx, seaY, t, isLight);
  }

  // Bandera de riesgo (sigue al vehículo activo)
  const flagPos = getFlagPos(tc, inc, fabX, portOX, portDX, almX, groundY, seaY);
  drawFlag(ctx, flagPos.x, flagPos.y, tc < inc.riskPoint, t, isLight);

  // Línea vertical de transferencia de riesgo
  const riskX = lerp(fabX+35, almX-35, inc.riskPoint);
  drawRiskLine(ctx, riskX, H*0.1, H*0.85, tc >= inc.riskPoint, isLight);

  // Halo de riesgo en el punto de transferencia
  if(Math.abs(tc - inc.riskPoint) < 0.04) {
    const pulse = 0.5 + 0.5*Math.sin(t*18);
    ctx.beginPath();
    ctx.arc(riskX, H*0.5, 18+pulse*10, 0, Math.PI*2);
    ctx.strokeStyle = isLight ? `rgba(234,88,12,${0.6+pulse*0.4})` : `rgba(255,200,50,${0.6+pulse*0.4})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Estrellas
  drawStars(ctx, W, H, t, isLight);

  // Etiqueta de etapa
  const etapa = getEtapa(tc, inc);
  // HUD superior
  drawHUD(ctx, W, H, tc, inc, isLight);

  return etapa;
}

// ── Utilidades de dibujo ──────────────────────────────────

function lerp(a,b,t){ return a+(b-a)*Math.max(0,Math.min(1,t)); }

function drawWaves(ctx,W,H,t,isLight){
  for(let i=0;i<3;i++){
    ctx.beginPath();
    ctx.strokeStyle = isLight ? `rgba(255,255,255,${0.2+i*0.1})` : `rgba(74,127,212,${0.12+i*0.05})`;
    ctx.lineWidth=1;
    for(let x=0;x<=W;x+=4){
      const y=H*0.60 + Math.sin((x/80)+t*2+i*1.2)*4 + i*5;
      i===0&&x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
}

function drawStars(ctx,W,H,t,isLight){
  if(isLight) return;
  const stars=[[50,20],[120,15],[200,30],[300,10],[400,25],[500,18],[600,12],[700,28],[800,8]];
  stars.forEach(([x,y],i)=>{
    const b=0.4+0.4*Math.sin(t*1.5+i);
    ctx.beginPath();
    ctx.arc(x*(W/860),y*(H/260),1,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${b})`;
    ctx.fill();
  });
}

function drawFabrica(ctx,x,groundY,H,color,label,isLight){
  const w=54,h=70;
  // Edificio principal
  ctx.fillStyle = isLight ? '#F3F4F6' : '#0f1117';
  ctx.strokeStyle=color;
  ctx.lineWidth=1.5;
  roundRect(ctx,x-w/2,groundY-h,w,h,4);
  ctx.fill(); ctx.stroke();
  // Ventanas
  for(let r=0;r<3;r++) for(let c=0;c<2;c++){
    ctx.fillStyle = isLight ? 'rgba(59,130,246,0.3)' : 'rgba(74,127,212,0.3)';
    roundRect(ctx,x-18+c*22,groundY-h+10+r*20,14,12,2);
    ctx.fill();
  }
  // Chimenea
  ctx.fillStyle = isLight ? '#E5E7EB' : '#1a1f2e'; ctx.strokeStyle=color; ctx.lineWidth=1;
  roundRect(ctx,x+8,groundY-h-18,10,20,2); ctx.fill(); ctx.stroke();
  // Humo
  for(let i=0;i<3;i++){
    ctx.beginPath();
    ctx.arc(x+13,groundY-h-22-i*8,3+i,0,Math.PI*2);
    ctx.fillStyle = isLight ? `rgba(156,163,175,${0.4-i*0.1})` : `rgba(100,110,130,${0.3-i*0.08})`;
    ctx.fill();
  }
  // Label
  ctx.fillStyle = isLight ? '#2563EB' : '#4a7fd4'; ctx.font='bold 9px Segoe UI';
  ctx.textAlign='center'; ctx.fillText(label,x,groundY+12);
}

function drawAlmacen(ctx,x,groundY,H,color,label,isLight){
  const w=54,h=55;
  ctx.fillStyle = isLight ? '#F3F4F6' : '#0f1117'; ctx.strokeStyle=color; ctx.lineWidth=1.5;
  roundRect(ctx,x-w/2,groundY-h,w,h,4); ctx.fill(); ctx.stroke();
  // Puerta
  ctx.fillStyle = isLight ? 'rgba(239,68,68,0.4)' : 'rgba(122,79,79,0.4)';
  roundRect(ctx,x-8,groundY-22,16,22,2); ctx.fill();
  // Ventanas
  for(let c=0;c<2;c++){
    ctx.fillStyle = isLight ? 'rgba(239,68,68,0.3)' : 'rgba(122,79,79,0.3)';
    roundRect(ctx,x-20+c*28,groundY-h+10,12,10,2); ctx.fill();
  }
  ctx.fillStyle = isLight ? '#DC2626' : '#7a4f4f'; ctx.font='bold 9px Segoe UI';
  ctx.textAlign='center'; ctx.fillText(label,x,groundY+12);
}

function drawPuerto(ctx,x,groundY,H,color,label,isLight){
  // Grúa
  ctx.strokeStyle=color; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(x,groundY); ctx.lineTo(x,groundY-50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,groundY-50); ctx.lineTo(x+28,groundY-50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+28,groundY-50); ctx.lineTo(x+28,groundY-30); ctx.stroke();
  // Cable
  ctx.strokeStyle = isLight ? 'rgba(107,114,128,0.6)' : 'rgba(100,120,150,0.6)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x+28,groundY-30); ctx.lineTo(x+28,groundY-14); ctx.stroke();
  // Base
  ctx.fillStyle=color; roundRect(ctx,x-6,groundY-10,12,10,2); ctx.fill();
  // Label
  ctx.fillStyle = isLight ? '#4B5563' : '#6b7280'; ctx.font='9px Segoe UI'; ctx.textAlign='center';
  label.split('\n').forEach((l,i)=>ctx.fillText(l,x,groundY+12+i*11));
}

function drawTruck(ctx,x,y,mirror,isLight){
  ctx.save();
  if(mirror){ ctx.translate(x,0); ctx.scale(-1,1); ctx.translate(-x,0); }
  // Cabina
  ctx.fillStyle = isLight ? '#2563EB' : '#1e3a5f'; ctx.strokeStyle = isLight ? '#1D4ED8' : '#4a7fd4'; ctx.lineWidth=1;
  roundRect(ctx,x-6,y-22,14,18,3); ctx.fill(); ctx.stroke();
  // Parabrisas
  ctx.fillStyle = isLight ? 'rgba(255,255,255,0.6)' : 'rgba(74,127,212,0.4)';
  roundRect(ctx,x-4,y-21,10,8,2); ctx.fill();
  // Carga
  ctx.fillStyle = isLight ? '#E5E7EB' : '#172035'; ctx.strokeStyle = isLight ? '#9CA3AF' : '#2a4a7f'; ctx.lineWidth=1;
  roundRect(ctx,x-22,y-19,18,15,2); ctx.fill(); ctx.stroke();
  // Ruedas
  [x-16,x-3,x+5].forEach(wx=>{
    ctx.beginPath(); ctx.arc(wx,y-2,5,0,Math.PI*2);
    ctx.fillStyle = isLight ? '#374151' : '#0d0d13'; ctx.strokeStyle = isLight ? '#111827' : '#374151'; ctx.lineWidth=1;
    ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(wx,y-2,2,0,Math.PI*2);
    ctx.fillStyle = isLight ? '#9CA3AF' : '#1a1f2e'; ctx.fill();
  });
  ctx.restore();
}

function drawShip(ctx,x,y,t,isLight){
  const bob = Math.sin(t*2)*2;
  y += bob;
  // Casco
  ctx.beginPath();
  ctx.moveTo(x-32,y+6);
  ctx.lineTo(x+32,y+6);
  ctx.lineTo(x+28,y+16);
  ctx.lineTo(x-28,y+16);
  ctx.closePath();
  ctx.fillStyle = isLight ? '#2563EB' : '#1e3a5f'; ctx.strokeStyle = isLight ? '#1D4ED8' : '#4a7fd4'; ctx.lineWidth=1.5;
  ctx.fill(); ctx.stroke();
  // Superestructura
  ctx.fillStyle = isLight ? '#F3F4F6' : '#172035'; ctx.strokeStyle = isLight ? '#D1D5DB' : '#2a4a7f'; ctx.lineWidth=1;
  roundRect(ctx,x-14,y-14,28,20,3); ctx.fill(); ctx.stroke();
  // Chimenea barco
  ctx.fillStyle = isLight ? '#3B82F6' : '#4a7fd4';
  roundRect(ctx,x-4,y-22,8,10,2); ctx.fill();
  // Ventanas barco
  for(let i=0;i<3;i++){
    ctx.beginPath(); ctx.arc(x-10+i*10,y-6,2.5,0,Math.PI*2);
    ctx.fillStyle = isLight ? 'rgba(59,130,246,0.5)' : 'rgba(74,127,212,0.5)'; ctx.fill();
  }
  // Contenedor en cubierta
  ctx.fillStyle = isLight ? '#10B981' : '#4a7f6a'; ctx.strokeStyle = isLight ? '#059669' : '#2a5f4a'; ctx.lineWidth=1;
  roundRect(ctx,x-20,y-2,14,10,1); ctx.fill(); ctx.stroke();
  ctx.fillStyle = isLight ? '#EF4444' : '#7a4f4f'; ctx.strokeStyle = isLight ? '#DC2626' : '#5f2a2a'; ctx.lineWidth=1;
  roundRect(ctx,x+4,y-2,14,10,1); ctx.fill(); ctx.stroke();
}

function drawFlag(ctx,x,y,esVendedor,t,isLight){
  const wave = Math.sin(t*6)*4;
  // Mástil
  ctx.strokeStyle = isLight ? '#4B5563' : '#c9d1dc'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-28); ctx.stroke();
  // Bandera
  ctx.beginPath();
  ctx.moveTo(x,y-28);
  ctx.lineTo(x+18+wave,y-22);
  ctx.lineTo(x,y-16);
  ctx.closePath();
  ctx.fillStyle = esVendedor ? (isLight ? '#2563EB' : '#4a7fd4') : (isLight ? '#DC2626' : '#7a4f4f');
  ctx.fill();
  // Texto en bandera
  ctx.fillStyle='#fff'; ctx.font='bold 6px Segoe UI'; ctx.textAlign='center';
  ctx.fillText(esVendedor?'V':'C', x+8+wave/2, y-21);
}

function drawRoad(ctx,x1,x2,y,tc,vendedorHasta,segStart,segEnd,isLight){
  const prog = Math.max(0,Math.min(1,(tc-segStart)/(segEnd-segStart)));
  const coveredX = lerp(x1,x2,prog);
  const isVendedor = vendedorHasta >= (segStart+segEnd)/2;
  // Recorrido hecho
  ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(coveredX,y);
  ctx.strokeStyle = isVendedor ? (isLight ? 'rgba(37,99,235,0.7)' : 'rgba(74,127,212,0.7)') : (isLight ? 'rgba(220,38,38,0.7)' : 'rgba(122,79,79,0.7)');
  ctx.lineWidth=3; ctx.stroke();
  // Pendiente
  ctx.beginPath(); ctx.moveTo(coveredX,y); ctx.lineTo(x2,y);
  ctx.strokeStyle = isLight ? 'rgba(156,163,175,0.5)' : 'rgba(55,65,81,0.4)'; ctx.lineWidth=3; ctx.stroke();
}

function drawSeaRoute(ctx,x1,x2,y,tc,vendedorHasta,segStart,segEnd,isLight){
  const prog = Math.max(0,Math.min(1,(tc-segStart)/(segEnd-segStart)));
  const coveredX = lerp(x1,x2,prog);
  const midSeg = (segStart+segEnd)/2;
  const isVendedor = vendedorHasta >= midSeg;
  ctx.setLineDash([6,4]);
  ctx.beginPath(); ctx.moveTo(x1,y); ctx.lineTo(coveredX,y);
  ctx.strokeStyle = isVendedor ? (isLight ? 'rgba(37,99,235,0.5)' : 'rgba(74,127,212,0.5)') : (isLight ? 'rgba(220,38,38,0.5)' : 'rgba(122,79,79,0.5)');
  ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(coveredX,y); ctx.lineTo(x2,y);
  ctx.strokeStyle = isLight ? 'rgba(156,163,175,0.5)' : 'rgba(55,65,81,0.25)'; ctx.lineWidth=2; ctx.stroke();
  ctx.setLineDash([]);
}

function drawRiskLine(ctx,x,y1,y2,passed,isLight){
  ctx.save();
  ctx.strokeStyle = passed ? (isLight ? 'rgba(220,38,38,0.5)' : 'rgba(122,79,79,0.5)') : (isLight ? 'rgba(234,88,12,0.7)' : 'rgba(255,200,50,0.7)');
  ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(x,y1); ctx.lineTo(x,y2); ctx.stroke();
  ctx.setLineDash([]);
  // Etiqueta
  ctx.fillStyle = passed ? (isLight ? 'rgba(220,38,38,0.8)' : 'rgba(122,79,79,0.8)') : (isLight ? 'rgba(234,88,12,0.9)' : 'rgba(255,200,50,0.9)');
  ctx.font='bold 8px Segoe UI'; ctx.textAlign='center';
  ctx.fillText('⚡ RIESGO', x, y1-4);
  ctx.restore();
}

function drawHUD(ctx,W,H,tc,inc,isLight){
  // Barra de progreso total
  const bw=W*0.6, bx=(W-bw)/2, by=H-18;
  ctx.fillStyle = isLight ? 'rgba(255,255,255,0.9)' : 'rgba(26,31,46,0.8)';
  roundRect(ctx,bx-6,by-6,bw+12,16,4); ctx.fill();
  // Fondo
  ctx.fillStyle = isLight ? '#E5E7EB' : '#1a1f2e';
  roundRect(ctx,bx,by,bw,6,3); ctx.fill();
  // Vendedor
  const vEnd = Math.min(tc, inc.vendedorHasta);
  ctx.fillStyle = isLight ? '#2563EB' : '#4a7fd4';
  roundRect(ctx,bx,by,bw*vEnd,6,3); ctx.fill();
  // Comprador (después del riskPoint)
  if(tc > inc.riskPoint){
    ctx.fillStyle = isLight ? '#DC2626' : '#7a4f4f';
    roundRect(ctx,bx+bw*inc.riskPoint,by,bw*(tc-inc.riskPoint),6,3); ctx.fill();
  }
  // Marcador de riesgo
  ctx.fillStyle = isLight ? '#EA580C' : '#fbbf24';
  roundRect(ctx,bx+bw*inc.riskPoint-1,by-2,2,10,1); ctx.fill();
  // Labels HUD
  ctx.fillStyle = isLight ? '#2563EB' : '#4a7fd4'; ctx.font='bold 8px Segoe UI'; ctx.textAlign='left';
  ctx.fillText('Vendedor',bx,by-8);
  ctx.fillStyle = isLight ? '#DC2626' : '#7a4f4f'; ctx.textAlign='right';
  ctx.fillText('Comprador',bx+bw,by-8);
}

function getFlagPos(tc,inc,fabX,portOX,portDX,almX,groundY,seaY){
  // Bandera sigue al vehículo activo
  if(tc < 0.28){
    const x = lerp(fabX+35, portOX-15, tc/0.28);
    return {x, y: groundY-28};
  } else if(tc < 0.72){
    const x = lerp(portOX+20, portDX-20, (tc-0.28)/0.44);
    return {x, y: seaY-20};
  } else {
    const x = lerp(portDX+15, almX-35, (tc-0.72)/0.28);
    return {x, y: groundY-28};
  }
}

function getEtapa(tc,inc){
  const etapas = inc.etapas;
  const breaks = [0, 0.28, 0.50, 0.72, 1.0];
  for(let i=0;i<breaks.length-1;i++){
    if(tc >= breaks[i] && tc < breaks[i+1]) return `Etapa ${i+1}/5: ${etapas[i]}`;
  }
  return `Etapa 5/5: ${etapas[4]}`;
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}
