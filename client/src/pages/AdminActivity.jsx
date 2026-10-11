import React,{useEffect,useMemo,useState}from'react';
import{api}from'../services/api';
import{formatDate,titleCase}from'../utils/transformers';

const labels={created_habit:'Created habit',updated_habit:'Updated habit',deleted_habit:'Deleted habit',completed_habit:'Completed habit'};

export default function AdminActivity(){
  const[a,setA]=useState([]),[type,setType]=useState(''),[q,setQ]=useState(''),[error,setError]=useState('');
  useEffect(()=>{api.activities().then(setA).catch(e=>setError(e.message))},[]);
  const rows=useMemo(()=>a.filter(x=>{
    const matchesType=!type||x.targetType===type;
    const who=`${x.user?.name||''} ${x.user?.email||''}`.toLowerCase();
    const action=(labels[x.action]||x.action||'').toLowerCase();
    return matchesType&&(!q||`${who} ${action} ${x.targetType||''}`.toLowerCase().includes(q.toLowerCase()));
  }),[a,type,q]);
  return <div className="container">
    <div className="page-intro"><span className="eyebrow">Administrator</span><h1 className="display">Activity history</h1><p className="muted">A chronological record of important habit actions.</p></div>
    <div className="surface" style={{padding:20,marginBottom:20}}><div className="actions">
      <input className="search-input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search user or action"/>
      <select className="search-input" value={type} onChange={e=>setType(e.target.value)}><option value="">All activity types</option><option value="Habit">Habit</option><option value="HabitCompletion">Habit completion</option><option value="Category">Category</option><option value="HealthyTip">Healthy tip</option><option value="User">User</option></select>
    </div></div>
    {error&&<div className="error-hint">{error}</div>}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>User</th><th>Action</th><th>Target</th><th>Date</th></tr></thead><tbody>{rows.map(x=><tr key={x._id}><td><strong>{x.user?.name||'Unknown user'}</strong><br/><span className="muted">{x.user?.email||''}</span></td><td>{labels[x.action]||titleCase((x.action||'activity').replaceAll('_',' '))}</td><td>{x.targetType}</td><td>{formatDate(x.date||x.createdAt)}</td></tr>)}</tbody></table></div>
    {!rows.length&&!error&&<div className="empty">No matching activity records.</div>}
  </div>
}
