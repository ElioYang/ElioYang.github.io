'use strict';
(async()=>{
 const response=await fetch('/data/ui.json');if(!response.ok)return;const ui=await response.json(),NS='http://www.w3.org/2000/svg';
 const el=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;return n;};
 const label=(svg,x,y,text,attrs={})=>{const n=el('text',{x,y,'font-size':12,...attrs},text);svg.append(n);return n;};
 const files={'ai-text':'jcdl_masking','pqc':'itc_concurrency'};const figures=[...document.querySelectorAll('[data-chart]')];
 async function initialize(fig){const response=await fetch('/data/'+files[fig.dataset.chart]+'.json');if(!response.ok)throw Error('Data unavailable');return response.json();}
 function draw(fig,d){const canvas=fig.querySelector('.chart-canvas');const width=Math.max(270,canvas.clientWidth),small=width<480;const type=fig.dataset.chart;const left=44,top=42,h=220,bottom=top+h,right=small?100:160,w=width-left-right,height=small?405:370;
  const svg=el('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':d.title});svg.append(el('title',{},d.title));
  label(svg,left,20,d.y_label);
  if(type==='ai-text'){
   const x=i=>left+i*w/(d.x.length-1),y=v=>bottom-v/d.y_max*h;
   for(let i=0;i<=4;i++){const value=d.y_max*i/4;svg.append(el('line',{x1:left,x2:left+w,y1:y(value),y2:y(value),stroke:'var(--line)'}));label(svg,left-8,y(value)+4,value.toFixed(2),{'text-anchor':'end'});}
   d.x.forEach((text,i)=>{const lines=small?text.split(' '):[text];lines.forEach((line,j)=>label(svg,x(i),bottom+24+j*16,line,{'text-anchor':'middle'}));});
   d.series.forEach(s=>{const color=s.highlight?'var(--accent)':'var(--series)';svg.append(el('polyline',{points:s.values.map((v,i)=>`${x(i)},${y(v)}`).join(' '),fill:'none',stroke:color,'stroke-width':s.highlight?2.5:1.5}));s.values.forEach((v,i)=>{const point=el('circle',{cx:x(i),cy:y(v),r:4,fill:color,tabindex:0,'aria-label':`${s.name} · ${d.x[i]}: ${v.toFixed(3)}`});point.append(el('title',{},`${s.name} · ${d.x[i]}: ${v.toFixed(3)}`));svg.append(point);});const name=small?(ui.chart_short_names[s.name]||s.name):s.name;const text=label(svg,left+w+9,y(s.values.at(-1))+(s.highlight?-9:4),name,{class:s.highlight?'accent-label':''});text.append(el('title',{},s.name));});
   const ref=d.reference_line;svg.append(el('line',{x1:left,x2:left+w,y1:y(ref.value),y2:y(ref.value),stroke:'var(--series)','stroke-dasharray':'4 4'}));label(svg,left+7,y(ref.value)-18,`${ref.name} (${ref.value.toFixed(3).replace(/^0/,'')})`);
  }else{
   const maximum=Math.max(...d.series.flatMap(s=>s.values)),ymax=Math.ceil(maximum/100)*100,y=v=>bottom-v/ymax*h,plotWidth=width-left-12;
   for(let i=0;i<=4;i++){const value=ymax*i/4;svg.append(el('line',{x1:left,x2:left+plotWidth,y1:y(value),y2:y(value),stroke:'var(--line)'}));label(svg,left-8,y(value)+4,String(value),{'text-anchor':'end'});}
   const gw=plotWidth/d.x.length,bw=Math.min(46,gw*.25);
   d.x.forEach((text,i)=>{const center=left+gw*(i+.5);label(svg,center,bottom+24,text,{'text-anchor':'middle'});d.series.forEach((s,j)=>{const xx=center+(j-.5)*(bw+8)-bw/2,value=s.values[i],color=s.highlight?'var(--accent)':'var(--series)';const bar=el('rect',{x:xx,y:y(value),width:bw,height:bottom-y(value),fill:color,tabindex:0,'aria-label':`${text} · ${s.name}: ${value.toFixed(1)} ms`});bar.append(el('title',{},`${text} · ${s.name}: ${value.toFixed(1)} ms`));svg.append(bar);label(svg,xx+bw/2,y(value)-8,value.toFixed(1),{'text-anchor':'middle'});});});
   label(svg,width/2,bottom+48,d.x_label,{'text-anchor':'middle'});d.series.forEach((s,j)=>{const name=small?ui.chart_short_names[s.name]||s.name:s.name;const text=label(svg,left,bottom+82+j*22,name,{class:s.highlight?'accent-label':''});text.append(el('title',{},s.name));});
  }
  let old=canvas.querySelector('svg');if(old)old.replaceWith(svg);else canvas.prepend(svg);
 }
 const data=new Map();for(const fig of figures){try{const d=await initialize(fig);data.set(fig,d);const heading=document.createElement('h2');heading.className='figure-title';heading.textContent=d.title;fig.prepend(heading);draw(fig,d);const caption=fig.querySelector('figcaption');caption.textContent=d.caption;const source=document.createElement('span');source.className='source';source.textContent=ui.chart_source.replace('{source}',d.source);caption.append(source);
  const details=document.createElement('details');details.className='chart-data';const summary=document.createElement('summary');summary.textContent=ui.chart_data;details.append(summary);const table=document.createElement('table'),head=document.createElement('thead'),body=document.createElement('tbody'),row=document.createElement('tr');[d.x_label,...d.series.map(s=>s.name)].forEach(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;row.append(th);});head.append(row);d.x.forEach((x,i)=>{const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=x;tr.append(th);d.series.forEach(s=>{const td=document.createElement('td');td.textContent=s.values[i]+(fig.dataset.chart==='pqc'?' ms':'');tr.append(td);});body.append(tr);});table.append(head,body);details.append(table);fig.querySelector('.chart-canvas').append(details);
 }catch{const p=document.createElement('p');p.className='error-message';p.textContent=ui.chart_error;fig.replaceChildren(p);}}
 let timer;function resize(){clearTimeout(timer);timer=setTimeout(()=>data.forEach((d,fig)=>draw(fig,d)),150);}window.addEventListener('resize',resize);window.addEventListener('orientationchange',resize);
})();
