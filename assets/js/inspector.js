'use strict';
(async()=>{
const root=document.querySelector('#inspector');let ui;
try{
 const responses=await Promise.all([fetch('/demo/rules.json'),fetch('/data/ui.json')]);if(responses.some(r=>!r.ok))throw Error('Data unavailable');
 const [rules,site]=await Promise.all(responses.map(r=>r.json()));ui=site.demo_ui;
 let age='teen',flatten=false,records=[],values={},guards={},openPanel=null,sequence=0;
 const n=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const b=(text,action,cls='')=>{const e=n('button',cls,text);e.type='button';e.addEventListener('click',action);return e;};
 const pending=r=>r.status==='pending_parent'||r.status==='pending_safeguards';
 const pendingFor=id=>records.find(r=>r.settingId===id&&pending(r));
 function resetValues(){values=Object.fromEntries(rules.settings.map(s=>[s.id,s.by_age[age].default]));guards={};openPanel=null;}
 resetValues();
 const heading=n('section','demo-heading');heading.append(n('p','eyebrow',ui.prototype),n('h1','',rules.app.name),n('p','',rules.app.one_liner));
 const controls=n('div','demo-controls'),ages=n('div','age-buttons');ages.setAttribute('role','group');ages.setAttribute('aria-label',ui.age_band);const ageButtons=[];
 rules.age_bands.forEach(a=>{const button=b(a.label,()=>{if(age===a.id)return;records.filter(pending).forEach(r=>{r.status='withdrawn';r.statusText=ui.age_withdrawn;r.actions=[];});age=a.id;resetValues();refresh();});button.dataset.age=a.id;ageButtons.push(button);ages.append(button);});controls.append(ages);
 const ageCheck=n('p','age-check');controls.append(ageCheck);const toggleLabel=n('label','flatten-label'),toggle=n('input');toggle.type='checkbox';toggle.addEventListener('change',()=>{flatten=toggle.checked;openPanel=null;renderCards();renderRecords();});toggleLabel.append(toggle,document.createTextNode(rules.flattened_view.toggle_label));controls.append(toggleLabel,n('p','flatten-explainer',rules.flattened_view.explainer));heading.append(controls);
 const layout=n('div','demo-layout'),cards=n('div','setting-list'),recordPanel=n('aside','record-panel');recordPanel.setAttribute('aria-label',rules.contest_record.title);const recordHead=n('div','record-heading');recordHead.append(n('h2','',rules.contest_record.title),b(ui.reset,()=>{records=[];flatten=false;toggle.checked=false;resetValues();refresh();},'text-button'));recordPanel.append(recordHead);
 const live=n('div','record-live');live.setAttribute('aria-live','polite');live.setAttribute('aria-relevant','additions text');recordPanel.append(live,n('p','record-disclaimer',rules.contest_record.does_not_show));recordPanel.lastChild.style.fontStyle='italic';layout.append(cards,recordPanel);
 const footer=n('footer','demo-footer');footer.append(document.createTextNode(rules.app.footer));const back=n('a','',ui.back);back.href='/';footer.append(n('br'),back);root.replaceChildren(heading,layout,footer);
 function refresh(focusId){ageButtons.forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.age===age)));ageCheck.textContent=rules.age_check[age];renderCards(focusId);renderRecords();}
 function actions(rec){const row=n('div','button-row record-actions');rec.actions.forEach(action=>{const label={approve:ui.approve,confirm:ui.turn_on,withdraw:ui.withdraw}[action];const button=b(label,()=>perform(rec.id,action),action==='withdraw'?'text-button':'primary');button.disabled=flatten;button.dataset.recordId=rec.id;button.dataset.action=action;row.append(button);});return row;}
 function perform(id,action){const rec=records.find(r=>r.id===id);if(!rec||!pending(rec)||rec.age!==age||flatten||!rec.actions.includes(action))return;
  const setting=rules.settings.find(s=>s.id===rec.settingId),rule=setting.by_age[rec.age];
  if(action==='withdraw'){rec.status='withdrawn';rec.statusText=ui.withdrawn;}
  else if(action==='approve'){values[setting.id]=rule.approved_value||rec.requested;rec.status='applied';rec.statusText=ui.approved;}
  else if(action==='confirm'){values[setting.id]=rec.requested;guards[setting.id]=rule.safeguards;rec.status='applied';rec.statusText=ui.safeguarded;}
  rec.actions=[];refresh(rec.settingId);
 }
 function renderRecords(){live.replaceChildren();if(!records.length){live.append(n('p','record-empty',ui.empty));return;}const list=n('ol','record-list');records.forEach(rec=>{const li=n('li','record-entry');li.dataset.recordId=rec.id;li.append(n('p','request-id',ui.record_id.replace('{id}',rec.id)),n('h3','',rec.setting));const dl=n('dl'),entries=[rec.setting,rec.band,rec.requested,rec.reason||ui.no_reason,rec.statusText,rec.ruleText,rec.visibility,rec.time];rules.contest_record.fields.forEach((field,i)=>dl.append(n('dt','',field),n('dd','',entries[i])));li.append(dl);if(rec.actions.length)li.append(actions(rec));list.append(li);});live.append(list);}
 function submit(setting,requested,reason){if(flatten||pendingFor(setting.id))return;const rule=setting.by_age[age];const type=requested===rule.default&&values[setting.id]!==rule.default?'revert':rule.outcome;
  const rec={id:String(++sequence),settingId:setting.id,setting:setting.label,age,band:rules.age_bands.find(a=>a.id===age).label,requested,reason,type,status:'applied',statusText:ui.applied,actions:[],ruleText:rules.outcome_types[type],visibility:rules.contest_record.who_can_see[age],time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:false})};records.unshift(rec);openPanel=null;
  if(type==='locked'){rec.status='locked';rec.statusText=rules.outcome_types.locked;}
  else if(type==='parent_approval'){rec.status='pending_parent';rec.statusText=ui.awaiting_parent;rec.actions=['approve','withdraw'];}
  else if(type==='with_safeguards'){rec.status='pending_safeguards';rec.statusText=ui.awaiting_confirmation;rec.actions=['confirm','withdraw'];}
  else{values[setting.id]=requested;if(type==='revert')delete guards[setting.id];}
  refresh(setting.id);
 }
 function renderCards(focusId){cards.replaceChildren();rules.settings.forEach(setting=>{
  const own=setting.by_age[age],shown=flatten?setting.by_age.adult:own,current=flatten?shown.default:values[setting.id],changed=flatten&&shown.default!==own.default,rec=pendingFor(setting.id);
  const card=n('section','setting-card'+(changed?' changed':''));card.id=setting.id;const title=n('h2','',setting.label);if(changed)title.append(n('span','pill changed-tag',ui.changed));card.append(title,n('p','setting-value',current));
  const flow=n('div','flow-strip');Object.entries(setting.flow).forEach(([key,value],i)=>{if(i)flow.append(n('span','',i===3?'·':'→'));const chip=n('span','flow-chip');chip.append(n('small','',key),document.createTextNode(value));flow.append(chip);});card.append(flow,n('p','why',shown.why));
  const basis=n('details','basis-detail'),summary=n('summary','pill',shown.basis==='prototype'?ui.prototype_basis:ui.analysis);summary.title=rules.basis_labels[shown.basis];basis.append(summary,n('p','basis-explanation',rules.basis_labels[shown.basis]));card.append(basis);
  if(shown.parent_sees)card.append(n('p','parent-sees',ui.parent_sees.replace('{value}',shown.parent_sees)));
  if(!flatten&&guards[setting.id]){const ul=n('ul','safeguards');guards[setting.id].forEach(g=>ul.append(n('li','',g)));card.append(ul);}
  if(rec&&!flatten){const panel=n('div','notice-panel');panel.append(n('p','',ui.pending));if(rec.status==='pending_safeguards'){panel.append(n('p','',own.notice));const ul=n('ul');own.safeguards.forEach(g=>ul.append(n('li','',g)));panel.append(ul);}else panel.append(n('p','',own.parent_action));panel.append(actions(rec));card.append(panel);}
  else{const contest=b(ui.contest,()=>{openPanel=openPanel===setting.id?null:setting.id;renderCards(setting.id);cards.querySelector(`#${setting.id} select, #${setting.id} textarea`)?.focus();});contest.id=setting.id+'-contest';contest.disabled=flatten;contest.setAttribute('aria-expanded',String(openPanel===setting.id));if(openPanel===setting.id)contest.setAttribute('aria-controls',setting.id+'-form');card.append(contest);}
  if(!flatten&&!rec&&openPanel===setting.id){const form=n('form','contest-panel');form.id=setting.id+'-form';const alternatives=own.options.filter(o=>o!==current&&!(current===own.approved_value&&o!==own.default));let select;
   if(alternatives.length){const label=n('label','',ui.requested);select=n('select');alternatives.forEach(value=>{const option=n('option','',value);option.value=value;select.append(option);});label.append(select);form.append(label);}
   const label=n('label','',alternatives.length?ui.reason:ui.objection),reason=n('textarea');reason.maxLength=280;label.append(reason);form.append(label);const error=n('p','form-error');error.id=setting.id+'-error';error.setAttribute('role','alert');error.hidden=true;reason.setAttribute('aria-describedby',error.id);form.append(error);const row=n('div','button-row'),send=n('button','primary',ui.submit);send.type='submit';row.append(send,b(ui.cancel,()=>{openPanel=null;renderCards(setting.id);}));form.append(row);
   form.addEventListener('submit',event=>{event.preventDefault();const trimmed=reason.value.trim();if(!alternatives.length&&!trimmed){error.textContent=ui.required;error.hidden=false;reason.setAttribute('aria-invalid','true');reason.focus();return;}submit(setting,select?select.value:current,trimmed);});card.append(form);
  }
  const last=records.find(r=>r.settingId===setting.id&&r.age===age);if(!flatten&&last&&!pending(last)){const status=n('p','setting-status',last.ruleText+(last.type==='locked'?' '+own.why:''));status.setAttribute('role','status');card.append(status);}cards.append(card);
 });if(focusId){const target=document.getElementById(focusId+'-contest')||cards.querySelector('#'+focusId+' button');target?.focus({preventScroll:true});}}
 refresh();
}catch{root.replaceChildren(Object.assign(document.createElement('p'),{className:'error-message',textContent:ui?.error||root.textContent}));}
})();
