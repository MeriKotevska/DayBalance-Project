import React,{useEffect,useState}from'react';
import{api}from'../services/api';
import{formatDate}from'../utils/transformers';
import{Modal,ErrorBox}from'../components/Layout';

const today=()=>new Date().toISOString().slice(0,10);
const empty={habit:'',user:'',date:today(),completed:true};

export default function AdminCompletions(){
  const[rows,setRows]=useState([]),[habits,setHabits]=useState([]),[users,setUsers]=useState([]);
  const[form,setForm]=useState(empty),[editId,setEditId]=useState(null),[del,setDel]=useState(null);
  const[error,setError]=useState(''),[message,setMessage]=useState('');
  const load=()=>Promise.all([api.completions(),api.habits(),api.users()]).then(([c,h,u])=>{setRows(c);setHabits(h);setUsers(u)}).catch(e=>setError(e.message));
  useEffect(()=>{load()},[]);
  const change=e=>setForm({...form,[e.target.name]:e.target.name==='completed'?e.target.value==='true':e.target.value});
  function validate(){if(!form.habit)return'Choose a habit.';if(!form.user)return'Choose a user.';if(!/^\d{4}-\d{2}-\d{2}$/.test(form.date))return'Choose a valid date.';return''}
  async function save(e){e.preventDefault();setError('');setMessage('');const problem=validate();if(problem)return setError(problem);try{const payload={habit:form.habit,user:form.user,date:new Date(form.date+'T12:00:00').toISOString(),completed:form.completed};if(editId){await api.updateCompletion(editId,payload);setMessage('Completion updated successfully.')}else{await api.complete(payload);setMessage('Completion created successfully.')}cancel();await load()}catch(e){setError(e.message)}}
  function startEdit(r){setEditId(r._id);setForm({habit:r.habit?._id||r.habit,user:r.user?._id||r.user,date:new Date(r.date).toISOString().slice(0,10),completed:r.completed});setError('');setMessage('');window.scrollTo({top:0,behavior:'smooth'})}
  function cancel(){setEditId(null);setForm({...empty,date:today()})}
  async function remove(){try{await api.deleteCompletion(del._id);setDel(null);setMessage('Completion deleted successfully.');await load()}catch(e){setDel(null);setError(e.message)}}
  return <div className="container">
    <div className="page-intro"><span className="eyebrow">Administrator</span><h1 className="display">Manage habit completions</h1><p>Create, edit or delete completion records stored in the database.</p></div>
    <form className="form-stack surface" style={{padding:25,maxWidth:850,marginBottom:24}} onSubmit={save}>
      <h2 style={{marginTop:0}}>{editId?'Edit completion':'Add completion'}</h2>
      <div className="form-row">
        <label className="field"><span>Habit</span><select name="habit" value={form.habit} onChange={change} required><option value="">Choose habit</option>{habits.map(h=><option key={h._id} value={h._id}>{h.name}</option>)}</select></label>
        <label className="field"><span>User</span><select name="user" value={form.user} onChange={change} required><option value="">Choose user</option>{users.map(u=><option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}</select></label>
      </div>
      <div className="form-row">
        <label className="field"><span>Date</span><input type="date" name="date" value={form.date} onChange={change} required/></label>
        <label className="field"><span>Status</span><select name="completed" value={String(form.completed)} onChange={change}><option value="true">Completed</option><option value="false">Not completed</option></select></label>
      </div>
      <ErrorBox error={error}/>{message&&<div className="notice">{message}</div>}
      <div className="actions"><button className="btn btn-primary">{editId?'Update completion':'Add completion'}</button>{editId&&<button type="button" className="btn btn-secondary" onClick={cancel}>Cancel edit</button>}</div>
    </form>
    <div className="table-wrap"><table className="data-table"><thead><tr><th>User</th><th>Habit</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r._id}><td><strong>{r.user?.name||'Unknown'}</strong><br/><span className="muted">{r.user?.email||''}</span></td><td>{r.habit?.name||'Unknown habit'}</td><td>{formatDate(r.date)}</td><td><span className={'status '+(!r.completed?'inactive':'')}>{r.completed?'Completed':'Not completed'}</span></td><td><div className="actions"><button className="btn btn-secondary" onClick={()=>startEdit(r)}>Edit</button><button className="btn btn-quiet" onClick={()=>setDel(r)}>Delete</button></div></td></tr>)}</tbody></table></div>
    {!rows.length&&<div className="empty">No completion records found.</div>}
    <Modal open={!!del} title="Delete completion?" onClose={()=>setDel(null)} onConfirm={remove}>This permanently deletes this completion record.</Modal>
  </div>
}
