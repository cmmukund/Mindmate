export async function requestNotifications(){ if(!('Notification' in window))return 'unsupported'; const p=await Notification.requestPermission(); return p; }
export function notify(title,body){ if('Notification' in window && Notification.permission==='granted' && document.visibilityState==='hidden') new Notification(title,{body,icon:'assets/icons/icon-192.png'}); }
