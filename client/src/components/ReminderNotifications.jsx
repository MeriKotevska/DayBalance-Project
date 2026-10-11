import React,{useEffect,useState}from'react';
import{api}from'../services/api';
import{useAuth}from'../context/AuthContext';

const dayKey=()=>{
  const d=new Date();
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};
const currentTime=()=>new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false});

export function ReminderNotifications(){
  const{user}=useAuth();
  useEffect(()=>{
    if(!user||!('Notification'in window))return;
    let cancelled=false;
    const check=async()=>{
      if(Notification.permission!=='granted')return;
      try{
        const habits=await api.habits({owner:user._id});
        if(cancelled)return;
        const now=currentTime(),today=dayKey();
        habits.filter(h=>h.active&&h.reminder===now).forEach(h=>{
          const key=`daybalance_reminder_${h._id}_${today}`;
          if(localStorage.getItem(key))return;
          const n=new Notification(`DayBalance reminder: ${h.name}`,{
            body:h.description||`Time for your ${h.name} habit.`,
            tag:`daybalance-${h._id}-${today}`
          });
          n.onclick=()=>{window.focus();window.location.assign(`/my-habits/${h._id}`);n.close()};
          localStorage.setItem(key,'sent');
        });
      }catch(e){/* reminders should never interrupt normal app use */}
    };
    check();
    const timer=setInterval(check,5000);
    return()=>{cancelled=true;clearInterval(timer)};
  },[user?._id]);
  return null;
}

export function ReminderSettings(){
  const supported='Notification'in window;
  const[permission,setPermission]=useState(supported?Notification.permission:'unsupported');
  async function enable(){
    if(!supported)return;
    const result=await Notification.requestPermission();
    setPermission(result);
    if(result==='granted')new Notification('DayBalance reminders enabled',{body:'Your habit reminders can now appear as browser notifications.'});
  }
  if(!supported)return <div className="notice">Browser notifications are not supported in this browser.</div>;
  return <div className="surface" style={{padding:20,marginBottom:20}}><div className="habit-row"><div className="habit-info"><strong>Habit reminders</strong><span>{permission==='granted'?'Notifications are enabled. Keep DayBalance open to receive reminders at the saved time.':permission==='denied'?'Notifications are blocked in this browser. Allow them in the site settings to use reminders.':'Enable browser notifications so saved reminder times can alert you.'}</span></div>{permission==='default'&&<button type="button" className="btn btn-secondary" onClick={enable}>Enable reminders</button>}{permission==='granted'&&<span className="badge">Enabled</span>}</div></div>;
}
