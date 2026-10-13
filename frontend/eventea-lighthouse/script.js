const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const storage={
  read(key,fallback){
    const value=localStorage.getItem(key);
    if(value===null)return fallback;
    try{return JSON.parse(value)}catch(error){console.error(`No se pudo leer ${key} del almacenamiento local.`,error);throw new Error(`Los datos guardados para ${key} no se pudieron leer.`)}
  },
  write(key,value){localStorage.setItem(key,JSON.stringify(value))}
};
const initialAdmins=['nicolas.ceballos01@uceva.edu.co','stiven.manzano01@uceva.edu.co'];
if(localStorage.getItem('eventa.adminEmails')===null)storage.write('eventa.adminEmails',initialAdmins);
const adminEmails=()=>storage.read('eventa.adminEmails',initialAdmins).map(email=>email.toLowerCase());
const accounts=()=>storage.read('eventa.accounts',[]);
const publishedEvents=()=>storage.read('eventa.events',[]);
const reservations=()=>storage.read('eventa.reservations',[]);
const savedEvents=()=>storage.read('eventa.savedEvents',{});
const currentEmail=()=>localStorage.getItem('eventa.currentUser');
const currentAccount=()=>accounts().find(account=>account.email===currentEmail())||null;
const eventFilters={category:'Todos',query:'',city:'',date:''};
let currentEvent=null;
let pendingRoute='';
let logoutReturnFocus=null;
function defaultFeaturedEvent(){
  return {id:'featured-concert',title:'Concierto en Vivo',category:'Música',
    description:'Vive una experiencia inolvidable con música, entretenimiento y actividades para todos.',
    date:'2026-11-15',time:'8:00 PM',location:'Cali',price:80000,capacity:5000,image:'img-1',ownerEmail:''};
}
const money=value=>'$'+Number(value||0).toLocaleString('es-CO');
const safeText=(value='')=>String(value);
let toastTimer=0;
function setMessage(element,text,type='error'){
  element.textContent=text;
  element.className=`form-message visible ${type}`;
}
function clearMessage(element){
  element.textContent='';
  element.className='form-message';
}
function showToast(title,message){
  clearTimeout(toastTimer);
  $('#toast-title').textContent=title;
  $('#toast-message').textContent=message;
  $('#app-toast').hidden=false;
  toastTimer=setTimeout(()=>{$('#app-toast').hidden=true},5000);
}
function openLogoutConfirmation(){
  logoutReturnFocus=document.activeElement;
  $('#logout-dialog').hidden=false;
  $('#cancel-logout').focus();
}
function closeLogoutConfirmation(restoreFocus=true){
  $('#logout-dialog').hidden=true;
  if(restoreFocus&&logoutReturnFocus instanceof HTMLElement)logoutReturnFocus.focus();
  logoutReturnFocus=null;
}
function eventSlug(title){
  return safeText(title).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function accountRole(email){
  const normalized=email.trim().toLowerCase();
  if(adminEmails().includes(normalized))return 'admin';
  if(normalized.endsWith('@uceva.edu.co'))return 'agent';
  if(normalized.endsWith('@gmail.com'))return 'user';
  return '';
}
function renderAccountMenu(){
  const account=currentAccount();
  const signedIn=Boolean(account);
  $('.nav-actions > a[href="#login"]').hidden=signedIn;
  $('.nav-actions > a[href="#registro"]').hidden=signedIn;
  $('#account-menu').hidden=!signedIn;
  if(account){
    const initials=Array.from(account.name.trim()).slice(0,2).join('').toLocaleUpperCase('es-CO');
    $('#account-avatar').textContent=initials||'EV';
    $('#account-avatar').setAttribute('aria-label',`Avatar de ${account.name}: ${initials||'EV'}`);
    $('#account-avatar').title=account.name;
    const agentLink=$('.navbar nav a[href="#agente"]');
    agentLink.textContent=account.role==='admin'?'Administración':'Agente';
  }else{
    $('#account-avatar').textContent='';
    $('#account-avatar').setAttribute('aria-label','Iniciales de la cuenta');
    $('#account-avatar').removeAttribute('title');
    $('.navbar nav a[href="#agente"]').textContent='Agente';
  }
}
function renderProfile(){
  const account=currentAccount();
  if(!account)return;
  $('#profile-name').value=account.name;
  $('#profile-email').value=account.email;
  $('#profile-role').textContent=account.role==='admin'?'Administrador':account.role==='agent'?'Agente de eventos':'Cliente';
  $('#profile-notifications').checked=account.notifications!==false;
}
$('#nav-toggle').addEventListener('click',()=>{
  const nav=$('#primary-nav');
  const expanded=$('#nav-toggle').getAttribute('aria-expanded')==='true';
  $('#nav-toggle').setAttribute('aria-expanded',String(!expanded));
  $('#nav-toggle').setAttribute('aria-label',expanded?'Abrir menú de navegación':'Cerrar menú de navegación');
  $('#nav-toggle').textContent=expanded?'☰':'×';
  nav.classList.toggle('open',!expanded);
});
$('#primary-nav').addEventListener('click',event=>{
  if(event.target.closest('a')){
    $('#primary-nav').classList.remove('open');
    $('#nav-toggle').setAttribute('aria-expanded','false');
    $('#nav-toggle').setAttribute('aria-label','Abrir menú de navegación');
    $('#nav-toggle').textContent='☰';
  }
});
$('.toast-close').addEventListener('click',()=>{$('#app-toast').hidden=true;clearTimeout(toastTimer)});
function routeRequiresRole(route){
  return ['agente','agente-reservas','crear-evento'].includes(route);
}
function show(){
  let id=location.hash.slice(1)||'inicio';
  if(!$('#'+id)||!$('#'+id).matches('main>section'))id='inicio';
  $('#primary-nav').classList.remove('open');
  $('#nav-toggle').setAttribute('aria-expanded','false');
  $('#nav-toggle').setAttribute('aria-label','Abrir menú de navegación');
  $('#nav-toggle').textContent='☰';
  const account=currentAccount();
  if(id==='ajustes'&&!account){
    pendingRoute='#ajustes';
    id='login';
    location.hash='login';
    setMessage($('#login-message'),'Inicia sesión para administrar tu perfil y tus preferencias.','error');
  }else if(routeRequiresRole(id)&&(!account||!['agent','admin'].includes(account.role))){
    pendingRoute=`#${id}`;
    id='login';
    location.hash='login';
    setMessage($('#login-message'),'Inicia sesión con una cuenta @uceva.edu.co para entrar al panel de agente.','error');
  }
  $$('main>section').forEach(section=>section.classList.toggle('active',section.id===id));
  $$('.navbar nav a').forEach(link=>link.classList.toggle('current',link.getAttribute('href')===`#${id}`));
  renderAccountMenu();
  if(id==='detalle'&&!currentEvent)openEvent(defaultFeaturedEvent());
  if(id==='inicio'){
    eventFilters.query='';
    eventFilters.city='';
    eventFilters.date='';
    eventFilters.category='Todos';
    localStorage.removeItem('eventa.search');
    $$('.search-box input').forEach(input=>{input.value=''});
    updateEventFilters();
  }
  if(id==='eventos')restaurarBusqueda();
  if(id==='reservas')renderUserReservations();
  if(id==='ajustes')renderProfile();
  if(id==='agente'||id==='agente-reservas')renderAgentDashboard();
  window.scrollTo(0,0);
}
addEventListener('hashchange',show);
$('#profile-form').addEventListener('submit',event=>{
  event.preventDefault();
  const account=currentAccount();
  if(!account)return requireSignIn('#ajustes');
  const name=$('#profile-name').value.trim();
  if(!name){
    setMessage($('#profile-message'),'Escribe tu nombre para guardar el perfil.');
    return;
  }
  account.name=name;
  account.notifications=$('#profile-notifications').checked;
  storage.write('eventa.accounts',accounts().map(item=>item.email===account.email?account:item));
  renderAccountMenu();
  setMessage($('#profile-message'),'Tus ajustes se guardaron correctamente.','success');
});
$('#logout').addEventListener('click',openLogoutConfirmation);
$('#cancel-logout').addEventListener('click',()=>closeLogoutConfirmation());
$('#logout-dialog').addEventListener('click',event=>{
  if(event.target===$('#logout-dialog'))closeLogoutConfirmation();
});
addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!$('#logout-dialog').hidden){
    event.preventDefault();
    closeLogoutConfirmation();
  }
});
$('#confirm-logout').addEventListener('click',()=>{
  closeLogoutConfirmation(false);
  localStorage.removeItem('eventa.currentUser');
  pendingRoute='';
  location.hash='inicio';
  renderAccountMenu();
  showToast('Sesión cerrada','Has cerrado sesión correctamente.');
});
$('#login-form').addEventListener('submit',event=>{
  event.preventDefault();
  const email=$('#login-email').value.trim().toLowerCase();
  const password=$('#login-password').value;
  const account=accounts().find(item=>item.email===email&&item.password===password);
  if(!account){
    setMessage($('#login-message'),'No encontramos una cuenta con ese correo y contraseña. Revisa tus datos o crea una cuenta.','error');
    return;
  }
  const role=accountRole(email);
  if(!role){
    setMessage($('#login-message'),'Este correo ya no tiene un tipo de cuenta autorizado.','error');
    return;
  }
  account.role=role;
  storage.write('eventa.accounts',accounts().map(item=>item.email===email?account:item));
  localStorage.setItem('eventa.currentUser',email);
  clearMessage($('#login-message'));
  renderAccountMenu();
  const destination=pendingRoute||'#inicio';
  pendingRoute='';
  location.hash=destination;
  showToast('Sesión iniciada','Iniciaste sesión correctamente.');
});
$('#register-form').addEventListener('submit',event=>{
  event.preventDefault();
  const name=$('#register-name').value.trim();
  const email=$('#register-email').value.trim().toLowerCase();
  const password=$('#register-password').value;
  const confirmation=$('#register-confirm-password').value;
  const role=accountRole(email);
  if(!role){
    setMessage($('#register-message'),'Usa un correo @gmail.com para una cuenta de cliente o @uceva.edu.co para agente o administrador autorizado.');
    return;
  }
  if(password!==confirmation){
    setMessage($('#register-message'),'Las contraseñas no coinciden.');
    return;
  }
  const allAccounts=accounts();
  if(allAccounts.some(account=>account.email===email)){
    setMessage($('#register-message'),'Ya existe una cuenta con ese correo. Inicia sesión.');
    return;
  }
  allAccounts.push({name,email,password,role});
  storage.write('eventa.accounts',allAccounts);
  $('#login-email').value=email;
  $('#login-password').value='';
  setMessage($('#login-message'),'Cuenta creada. Ingresa tu contraseña para iniciar sesión.','success');
  location.hash='login';
  $('#login-password').focus();
});
$$('.forgot').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  alert('Para recuperar la contraseña, contacta al administrador de EVENTA.');
}));
$$('[data-go]').forEach(button=>button.addEventListener('click',event=>{
  event.preventDefault();
  location.hash=button.dataset.go;
}));
function updateEventFilters(){
  const cards=$$('#public-event-list .event-card');
  cards.forEach(card=>{
    const category=$('.event-category',card).textContent.trim();
    const price=$('strong',card).textContent.trim();
    const text=`${card.textContent} ${card.dataset.eventLocation||''}`.toLowerCase();
    const matchCategory=eventFilters.category==='Todos'||category===eventFilters.category||(eventFilters.category==='Gratis'&&price==='Gratis');
    const matchQuery=!eventFilters.query||text.includes(eventFilters.query);
    const matchCity=!eventFilters.city||text.includes(eventFilters.city);
    const matchDate=!eventFilters.date||card.dataset.eventDate===eventFilters.date||text.includes(eventFilters.date);
    card.hidden=!(matchCategory&&matchQuery&&matchCity&&matchDate);
  });
  const emptyState=$('#events-empty-state');
  if(emptyState)emptyState.hidden=cards.some(card=>!card.hidden);
  $$('.filter').forEach(filter=>filter.classList.toggle('active',filter.textContent.trim()===eventFilters.category));
}
function filterByCategory(category){
  eventFilters.category=category;
  updateEventFilters();
}
$$('.filter').forEach(filter=>filter.addEventListener('click',()=>filterByCategory(filter.textContent.trim())));
$$('.categories a').forEach(link=>link.addEventListener('click',()=>filterByCategory(link.dataset.cat)));
$$('.destination-card').forEach(link=>link.addEventListener('click',()=>{
  const city=link.dataset.city;
  const search={query:'',city,date:''};
  storage.write('eventa.search',search);
  eventFilters.query='';
  eventFilters.city=city.toLowerCase();
  eventFilters.date='';
  eventFilters.category='Todos';
  const inputs=$$('.search-box input');
  if(inputs[0])inputs[0].value='';
  if(inputs[1])inputs[1].value=city;
  if(inputs[2])inputs[2].value='';
  updateEventFilters();
}));
function restaurarBusqueda(){
  const saved=storage.read('eventa.search',null);
  if(saved){
    eventFilters.query=(saved.query||'').trim().toLowerCase();
    eventFilters.city=(saved.city||'').trim().toLowerCase();
    eventFilters.date=(saved.date||'').trim();
    const inputs=$$('.search-box input');
    if(inputs[0])inputs[0].value=saved.query||'';
    if(inputs[1])inputs[1].value=saved.city||'';
    if(inputs[2])inputs[2].value=saved.date||'';
  }
  updateEventFilters();
}
$('.search-box .btn').addEventListener('click',event=>{
  event.preventDefault();
  const inputs=$$('.search-box input');
  const search={query:inputs[0].value.trim(),city:inputs[1].value.trim(),date:inputs[2].value.trim()};
  storage.write('eventa.search',search);
  eventFilters.query=search.query.toLowerCase();
  eventFilters.city=search.city.toLowerCase();
  eventFilters.date=search.date;
  updateEventFilters();
  location.hash='eventos';
});
function formatDate(date){
  if(!date)return 'Fecha por confirmar';
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return date;
  const parsed=new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime())?date:parsed.toLocaleDateString('es-CO',{year:'numeric',month:'long',day:'numeric'});
}
function dateFromCard(card){
  const detail=$('.event-body p',card)?.textContent.trim()||'';
  return detail;
}
function eventFromCard(card){
  const title=$('h3',card).textContent.trim();
  const id=card.dataset.eventId||eventSlug(title);
  const saved=publishedEvents().find(item=>item.id===id);
  if(saved)return saved;
  const photo=[...$('.event-img',card).classList].find(name=>/^img-\d+$/.test(name))||'img-1';
  if(card.classList.contains('reservation-card')){
    return {id,title,category:$('.event-category',card).textContent.trim(),description:`Disfruta ${title} en una experiencia inolvidable.`,
      date:card.dataset.eventDate||dateFromCard(card),time:card.dataset.eventTime||'',location:card.dataset.eventLocation||'Lugar por confirmar',
      price:Number(card.dataset.eventPrice)||0,capacity:5000,image:photo,ownerEmail:card.dataset.ownerEmail||''};
  }
  const priceText=$('strong',card)?.textContent||'';
  const price=Number(priceText.replace(/[^\d]/g,''))||0;
  const detail=dateFromCard(card);
  const parts=detail.split('•').map(value=>value.trim());
  return {
    id,title,category:$('.event-category',card).textContent.trim(),description:`Disfruta ${title} en una experiencia inolvidable.`,
    date:parts[0]||detail,time:'Hora por confirmar',location:card.dataset.eventLocation||parts[1]||'Lugar por confirmar',
    price,capacity:5000,image:photo,ownerEmail:'',createdBy:'EVENTA'
  };
}
function openEvent(eventData){
  currentEvent=eventData;
  $('#d-title').textContent=eventData.title;
  $('#d-cat').textContent=eventData.category;
  $('#d-description').textContent=eventData.description||'Disfruta de este evento en EVENTA.';
  $('#d-date').textContent=formatDate(eventData.date);
  $('#d-time').textContent=eventData.time||'Hora por confirmar';
  $('#d-location').textContent=eventData.location||'Lugar por confirmar';
  $('.detail-banner').className=`detail-banner event-img img-large ${eventData.image||'img-1'}`;
  const ticketOptions=$('#ticket-options');
  if(publishedEvents().some(item=>item.id===eventData.id)){
    ticketOptions.replaceChildren(createTicketRow('General',eventData.price||0));
  }else{
    ticketOptions.replaceChildren(createTicketRow('General',80000),createTicketRow('Preferencial',120000),createTicketRow('VIP',180000));
  }
  total();
  renderSaveButton();
}
function createTicketRow(name,price){
  const row=document.createElement('div');
  row.className='tk';
  row.dataset.price=String(price);
  const info=document.createElement('div');
  const label=document.createElement('b');
  label.textContent=name;
  const amount=document.createElement('p');
  amount.textContent=price?money(price):'Gratis';
  info.append(label,amount);
  const quantity=document.createElement('div');
  quantity.className='quantity';
  const decrease=document.createElement('button');
  decrease.type='button';decrease.dataset.q='-1';decrease.setAttribute('aria-label','Quitar');decrease.textContent='−';
  const count=document.createElement('span');count.textContent='0';
  const increase=document.createElement('button');
  increase.type='button';increase.dataset.q='1';increase.setAttribute('aria-label','Agregar');increase.textContent='+';
  quantity.append(decrease,count,increase);
  row.append(info,quantity);
  return row;
}
document.addEventListener('click',event=>{
  const detailLink=event.target.closest('a[href="#detalle"]');
  if(detailLink){
    const card=detailLink.closest('.event-card,.reservation-card');
    const linkedEvent=detailLink.dataset.eventId?findEvent(detailLink.dataset.eventId):null;
    if(card)openEvent(eventFromCard(card));
    else if(linkedEvent)openEvent(linkedEvent);
    else if(detailLink.closest('.hero-card'))openEvent(defaultFeaturedEvent());
  }
  const quantityButton=event.target.closest('#ticket-options [data-q]');
  if(quantityButton){
    const count=$('span',quantityButton.parentElement);
    count.textContent=String(Math.max(0,Number(count.textContent)+Number(quantityButton.dataset.q)));
    total();
  }
});
function total(){
  const value=$$('.tk').reduce((sum,row)=>sum+Number(row.dataset.price)*Number($('.quantity span',row).textContent),0);
  $('#d-total').textContent=money(value);
  return value;
}
function selectedTicketCount(){
  return $$('.tk').reduce((sum,row)=>sum+Number($('.quantity span',row).textContent),0);
}
function findEvent(id){
  return publishedEvents().find(item=>item.id===id)||null;
}
function requireSignIn(returnTo='#detalle'){
  pendingRoute=returnTo;
  setMessage($('#login-message'),'Inicia sesión para guardar eventos y hacer reservas.','error');
  location.hash='login';
}
$('#reservar').addEventListener('click',()=>{
  if(!currentAccount())return requireSignIn('#detalle');
  const count=selectedTicketCount();
  if(!count){
    alert('Selecciona al menos una entrada.');
    return;
  }
  if(currentEvent){
    const eventRecord=findEvent(currentEvent.id);
    if(eventRecord){
      const sold=reservations().filter(item=>item.eventId===eventRecord.id&&item.status==='Confirmada').reduce((sum,item)=>sum+item.quantity,0);
      if(sold+count>eventRecord.capacity){
        alert('No hay suficientes entradas para completar la reserva.');
        return;
      }
    }
  }
  const account=currentAccount();
  const booking={id:`r-${Date.now()}`,eventId:currentEvent.id,title:currentEvent.title,category:currentEvent.category,
    image:currentEvent.image,price:total(),quantity:count,date:currentEvent.date,time:currentEvent.time,location:currentEvent.location,
    ownerEmail:currentEvent.ownerEmail||'',userEmail:account.email,userName:account.name,createdAt:new Date().toISOString(),status:'Confirmada'};
  storage.write('eventa.reservations',[...reservations(),booking]);
  $$('.quantity span').forEach(span=>span.textContent='0');
  total();
  showToast('¡Reserva exitosa!','La reserva quedó guardada en Mis reservas y en el panel del agente.');
  location.hash='reservas';
});
function renderSaveButton(){
  const account=currentAccount();
  const saved=account&&(savedEvents()[account.email]||[]).some(item=>(typeof item==='string'?item:item.id)===currentEvent?.id);
  $('#guardar').textContent=saved?'♥ Evento guardado':'♡ Guardar evento';
}
$('#guardar').addEventListener('click',()=>{
  if(!currentAccount())return requireSignIn('#detalle');
  if(!currentEvent)return;
  const account=currentAccount();
  const allSaved=savedEvents();
  const ids=allSaved[account.email]||[];
  const alreadySaved=ids.some(item=>(typeof item==='string'?item:item.id)===currentEvent.id);
  if(alreadySaved)allSaved[account.email]=ids.filter(item=>(typeof item==='string'?item:item.id)!==currentEvent.id);
  else allSaved[account.email]=[...ids,{...currentEvent}];
  storage.write('eventa.savedEvents',allSaved);
  renderSaveButton();
});
function makeElement(tag,className,text){
  const element=document.createElement(tag);
  if(className)element.className=className;
  if(text!==undefined)element.textContent=safeText(text);
  return element;
}
function renderDynamicEventCards(){
  $$('#public-event-list .event-card[data-custom="true"]').forEach(card=>card.remove());
  publishedEvents().forEach(item=>{
    const card=makeElement('article','event-card');
    card.dataset.eventId=item.id;card.dataset.custom='true';
    card.dataset.eventDate=item.date;
    const image=makeElement('div',`event-img ${item.image||'img-1'}`);
    const body=makeElement('div','event-body');
    body.append(makeElement('span','event-category',item.category),makeElement('h3','',item.title),
      makeElement('p','',`${formatDate(item.date)} • ${item.location}`),
      makeElement('strong','',Number(item.price)?`Desde ${money(item.price)}`:'Gratis'));
    const link=makeElement('a','btn btn-purple','Ver evento');
    link.href='#detalle';body.append(link);card.append(image,body);$('#public-event-list').append(card);
  });
  updateEventFilters();
}
function renderUserReservations(){
  const email=currentEmail();
  const userBookings=email?reservations().filter(item=>item.userEmail===email&&item.status==='Confirmada'):[];
  const ids=email?(savedEvents()[email]||[]):[];
  const active=$('#user-reservations');
  active.replaceChildren();
  userBookings.forEach(item=>active.append(reservationCard(item,'Reservada')));
  ids.forEach(saved=>{
    const item=typeof saved==='string'?findEvent(saved):saved;
    if(item)active.append(reservationCard(item,'Guardada'));
  });
  if(!active.children.length)active.append(makeElement('p','muted-note',email?'Aún no tienes reservas ni eventos guardados. Explora eventos para empezar.':'Inicia sesión para consultar tus reservas.'));
  $('#user-history').replaceChildren(makeElement('p','muted-note','Aquí aparecerá tu historial de eventos finalizados.'));
}
function reservationCard(item,status){
  const card=makeElement('article','reservation-card');
  const image=makeElement('div',`event-img ${item.image||'img-1'}`);
  const info=document.createElement('div');
  info.append(makeElement('span','event-category',item.category||'Evento'),makeElement('h3','',item.title),
    makeElement('p','',`${formatDate(item.date)}${item.time?` • ${item.time}`:''}`),
    makeElement('span','status',status));
  if(item.quantity)info.append(makeElement('p','muted-note',`${item.quantity} entrada(s) · ${money(item.price)}`));
  const link=makeElement('a','btn btn-purple',status==='Guardada'?'Ver evento':'Ver reserva');
  link.href='#detalle';  card.dataset.eventId=item.eventId||item.id||'';
  card.dataset.eventDate=item.date||'';
  card.dataset.eventTime=item.time||'';
  card.dataset.eventLocation=item.location||'';
  card.dataset.eventPrice=String(item.price&&item.quantity?item.price/item.quantity:item.price||0);
  card.dataset.ownerEmail=item.ownerEmail||'';
  card.append(image,info,link);
  return card;
}
function seedAgentEvents(account){
  const seedKey=`eventa.agentDemoSeeded.${account.email}`;
  if(localStorage.getItem(seedKey)!==null)return publishedEvents();
  const events=publishedEvents();
  const ownerSlug=eventSlug(account.email);
  const demoEvents=[
    {id:`${ownerSlug}-encuentro-tecnologia`,title:'Cumbre de Innovación Digital',category:'Tecnología',
      description:'Conoce las últimas tendencias, proyectos e ideas en tecnología.',
      date:'2026-11-02',time:'6:00 PM',location:'Bogotá',price:35000,capacity:180,image:'img-8',ownerEmail:account.email,createdBy:account.name},
    {id:`${ownerSlug}-feria-emprendimiento`,title:'Feria de Emprendimiento',category:'Cultura',
      description:'Un espacio para descubrir proyectos creativos y emprendimientos locales.',
      date:'2026-11-18',time:'2:00 PM',location:'Cali',price:20000,capacity:120,image:'img-7',ownerEmail:account.email,createdBy:account.name},
    {id:`${ownerSlug}-experiencia-visual`,title:'Experiencia Visual',category:'Arte',
      description:'Una experiencia para explorar instalaciones artísticas y nuevos formatos visuales.',
      date:'2026-11-28',time:'4:00 PM',location:'Medellín',price:25000,capacity:90,image:'img-6',ownerEmail:account.email,createdBy:account.name}
  ];
  const eventIds=new Set(events.map(item=>item.id));
  const newEvents=demoEvents.filter(item=>!eventIds.has(item.id));
  const updatedEvents=[...events,...newEvents];
  if(newEvents.length)storage.write('eventa.events',updatedEvents);
  localStorage.setItem(seedKey,'true');
  if(newEvents.length)renderDynamicEventCards();
  return updatedEvents;
}
function renderAgentDashboard(){
  const account=currentAccount();
  if(!account||!['agent','admin'].includes(account.role))return;
  const ownEvents=seedAgentEvents(account).filter(item=>item.ownerEmail===account.email);
  const eventIds=new Set(ownEvents.map(item=>item.id));
  const publishedEventIds=new Set(publishedEvents().map(item=>item.id));
  const ownReservations=reservations().filter(item=>item.status==='Confirmada'&&
    (eventIds.has(item.eventId)||!publishedEventIds.has(item.eventId)));
  $('#agent-event-count').textContent=String(ownEvents.length);
  $('#agent-reservation-count').textContent=String(ownReservations.length);
  $('#agent-attendee-count').textContent=String(ownReservations.reduce((sum,item)=>sum+item.quantity,0));
  $('#agent-revenue').textContent=money(ownReservations.reduce((sum,item)=>sum+item.price,0));
  const rows=$('#published-events-body');
  rows.replaceChildren();
  if(!ownEvents.length){
    const row=document.createElement('tr'),cell=makeElement('td','','Aún no has publicado eventos.');
    cell.colSpan=5;row.append(cell);rows.append(row);
  }
  ownEvents.forEach(item=>{
    const count=ownReservations.filter(booking=>booking.eventId===item.id).reduce((sum,booking)=>sum+booking.quantity,0);
    const row=document.createElement('tr');
    [item.title,formatDate(item.date),String(count),'Activo'].forEach(value=>row.append(makeElement('td','',value)));
    const actions=makeElement('td');
    const link=makeElement('a','','Ver');link.href='#detalle';link.dataset.eventId=item.id;
    actions.append(link);row.append(actions);rows.append(row);
  });
  $('#admin-tools').hidden=account.role!=='admin';
  if(account.role==='admin')renderAdminList();
  const reservationRows=$('#agent-reservations-body');
  reservationRows.replaceChildren();
  if(!ownReservations.length){
    const row=document.createElement('tr'),cell=makeElement('td','','Todavía no hay reservas para tus eventos.');
    cell.colSpan=6;row.append(cell);reservationRows.append(row);
  }
  ownReservations.forEach(item=>{
    const row=document.createElement('tr');
    [new Date(item.createdAt).toLocaleDateString('es-CO'),item.title,item.userName,String(item.quantity),item.price?money(item.price):'Gratis',item.status]
      .forEach(value=>row.append(makeElement('td','',value)));
    reservationRows.append(row);
  });
}
function renderAdminList(){
  $('#admin-list').textContent=`Cuentas autorizadas: ${adminEmails().join(', ')}`;
}
$('#add-admin-form').addEventListener('submit',event=>{
  event.preventDefault();
  const current=currentAccount();
  const email=$('#new-admin-email').value.trim().toLowerCase();
  if(!current||current.role!=='admin'){
    setMessage($('#admin-message'),'Solo un administrador autorizado puede agregar administradores.');
    return;
  }
  if(!email.endsWith('@uceva.edu.co')){
    setMessage($('#admin-message'),'El nuevo administrador debe usar un correo @uceva.edu.co.');
    return;
  }
  if(adminEmails().includes(email)){
    setMessage($('#admin-message'),'Ese correo ya está autorizado como administrador.');
    return;
  }
  storage.write('eventa.adminEmails',[...adminEmails(),email]);
  clearMessage($('#admin-message'));
  $('#new-admin-email').value='';
  renderAdminList();
  alert('Administrador autorizado. Esa persona debe crear su cuenta con ese correo para ingresar.');
});
function updatePreview(){
  const preview=$('.preview-event');
  if(!preview)return;
  $('.event-img',preview).className=`event-img ${$('#event-image').value}`;
  $('.event-category',preview).textContent=$('#event-category').value;
  $('h3',preview).textContent=$('#event-name').value.trim()||'Nombre del evento';
  $('p',preview).textContent=`${$('#event-date').value||'Fecha'} • ${$('#event-time').value||'Hora'}`;
  $('strong',preview).textContent=Number($('#event-price').value)?money($('#event-price').value):'Gratis';
}
$$('#create-event-form input, #create-event-form textarea, #create-event-form select').forEach(field=>{
  field.addEventListener('input',updatePreview);
  field.addEventListener('change',updatePreview);
});
$('#create-event-form').addEventListener('submit',event=>{
  event.preventDefault();
  const account=currentAccount();
  if(!account||!['agent','admin'].includes(account.role)){
    location.hash='login';
    setMessage($('#login-message'),'Inicia sesión con una cuenta autorizada de agente para publicar eventos.');
    return;
  }
  const capacity=Number($('#event-capacity').value),price=Number($('#event-price').value);
  const date=$('#event-date').value,time=$('#event-time').value;
  if(!Number.isInteger(capacity)||capacity<1||!Number.isFinite(price)||price<0){
    setMessage($('#event-message'),'La capacidad debe ser un entero positivo y el precio no puede ser negativo.');
    return;
  }
  if(new Date(`${date}T${time}`)<=new Date()){
    setMessage($('#event-message'),'La fecha y hora del evento deben ser futuras.');
    return;
  }
  const title=$('#event-name').value.trim();
  const id=`${eventSlug(title)}-${Date.now()}`;
  const item={id,title,description:$('#event-description').value.trim(),category:$('#event-category').value,date,time,
    location:$('#event-location').value.trim(),price,capacity,image:$('#event-image').value,ownerEmail:account.email,createdBy:account.name};
  storage.write('eventa.events',[...publishedEvents(),item]);
  clearMessage($('#event-message'));
  renderDynamicEventCards();
  renderAgentDashboard();
  event.target.reset();
  updatePreview();
  setMessage($('#event-message'),'Evento publicado y guardado. Ya aparece en eventos y en tus publicaciones.','success');
  location.hash='agente';
});
$('#event-capacity').addEventListener('input',event=>{
  if(Number(event.target.value)<1)event.target.setCustomValidity('La capacidad debe ser al menos 1.');
  else event.target.setCustomValidity('');
});
$$('.empty-box .btn,.organizer .btn').forEach(button=>button.addEventListener('click',()=>{
  alert('Gracias, te contactaremos pronto.');
}));
$('#exportar').addEventListener('click',()=>{
  const rows=[['Fecha','Evento','Usuario','Entradas','Total','Estado'],...reservations()
    .filter(item=>publishedEvents().some(published=>published.id===item.eventId&&published.ownerEmail===currentEmail()))
    .map(item=>[new Date(item.createdAt).toLocaleDateString('es-CO'),item.title,item.userName,item.quantity,money(item.price),item.status])];
  const csv=rows.map(row=>row.map(value=>`"${safeText(value).replaceAll('"','""')}"`).join(',')).join('\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='reservas.csv';link.click();URL.revokeObjectURL(url);
});
renderDynamicEventCards();
renderAccountMenu();
show();
