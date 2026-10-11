import React,{useEffect,useState}from'react';
import{api}from'../services/api';
import{Modal,ErrorBox}from'../components/Layout';

const emptyForm={name:'',description:'',category:'',owner:'',timeOfDay:'anytime',frequency:'daily',duration:10,difficulty:'easy',reminder:'',active:true};

export default function AdminHabits(){
  const[habits,setHabits]=useState([]),[users,setUsers]=useState([]),[categories,setCategories]=useState([]);
  const[form,setForm]=useState(emptyForm),[editId,setEditId]=useState(null),[del,setDel]=useState(null);
  const[error,setError]=useState(''),[message,setMessage]=useState('');

  const load=()=>Promise.all([api.habits(),api.users(),api.categories()]).then(([h,u,c])=>{setHabits(h);setUsers(u);setCategories(c)}).catch(e=>setError(e.message));
  useEffect(()=>{load()},[]);

  function change(e){const{name,value,type,checked}=e.target;setForm({...form,[name]:type==='checkbox'?checked:type==='number'?Number(value):value})}
  function validate(){
    if(form.name.trim().length<2||form.name.trim().length>100)return'Name must be 2–100 characters.';
    if(!form.owner)return'Choose an owner.';
    if(!form.category)return'Choose a category.';
    if(form.duration<1||form.duration>480)return'Duration must be 1–480 minutes.';
    if(form.reminder&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(form.reminder))return'Reminder must be HH:MM.';
    return'';
  }

  async function save(e){
    e.preventDefault();setError('');setMessage('');const problem=validate();if(problem)return setError(problem);
    const payload={...form,name:form.name.trim(),description:form.description.trim(),reminder:form.reminder||null};
    try{
      if(editId){await api.updateHabit(editId,payload);setMessage('Habit updated successfully.');}
      else{await api.createHabit(payload);setMessage('Habit created successfully.');}
      cancelEdit();await load();
    }catch(e){setError(e.message)}
  }

  function startEdit(h){
    setEditId(h._id);setForm({name:h.name||'',description:h.description||'',category:h.category?._id||h.category||'',owner:h.owner?._id||h.owner||'',timeOfDay:h.timeOfDay||'anytime',frequency:h.frequency||'daily',duration:h.duration||10,difficulty:h.difficulty||'easy',reminder:h.reminder||'',active:h.active!==false});
    setError('');setMessage('');window.scrollTo({top:0,behavior:'smooth'});
  }
  function cancelEdit(){setEditId(null);setForm(emptyForm)}
  async function remove(){try{await api.deleteHabit(del._id);setDel(null);setMessage('Habit deleted successfully.');await load()}catch(e){setDel(null);setError(e.message)}}

  return <div className="container">
    <div className="page-intro"><span className="eyebrow">Administrator</span><h1 className="display">Manage habits</h1><p>Manage habits for all registered users.</p></div>
    <form className="form-stack surface" style={{padding:25,maxWidth:850,marginBottom:24}} onSubmit={save}>
      <h2 style={{marginTop:0}}>{editId?'Edit habit':'Add habit'}</h2>
      <div className="form-row">
        <label className="field"><span>Name</span><input name="name" value={form.name} onChange={change} required minLength="2" maxLength="100"/></label>
        <label className="field"><span>Owner</span><select name="owner" value={form.owner} onChange={change} required><option value="">Choose user…</option>{users.map(u=><option key={u._id} value={u._id}>{u.name} — {u.email}</option>)}</select></label>
      </div>
      <label className="field"><span>Description</span><textarea name="description" value={form.description} onChange={change} maxLength="500"/></label>
      <div className="form-row">
        <label className="field"><span>Category</span><select name="category" value={form.category} onChange={change} required><option value="">Choose…</option>{categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
        <label className="field"><span>Time of day</span><select name="timeOfDay" value={form.timeOfDay} onChange={change}>{['morning','afternoon','evening','anytime'].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      </div>
      <div className="form-row">
        <label className="field"><span>Frequency</span><select name="frequency" value={form.frequency} onChange={change}>{['daily','weekly','weekdays','weekends','custom'].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
        <label className="field"><span>Difficulty</span><select name="difficulty" value={form.difficulty} onChange={change}>{['easy','medium','hard'].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
      </div>
      <div className="form-row">
        <label className="field"><span>Duration (minutes)</span><input name="duration" type="number" min="1" max="480" value={form.duration} onChange={change}/></label>
        <label className="field"><span>Reminder</span><input name="reminder" type="time" value={form.reminder} onChange={change}/></label>
      </div>
      <label className="toggle"><input name="active" type="checkbox" checked={form.active} onChange={change}/><span>Active habit</span></label>
      <ErrorBox error={error}/>{message&&<div className="notice">{message}</div>}
      <div className="actions"><button className="btn btn-primary">{editId?'Update habit':'Add habit'}</button>{editId&&<button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel edit</button>}</div>
    </form>

    <div className="table-wrap"><table className="data-table"><thead><tr><th>Habit</th><th>Owner</th><th>Category</th><th>Frequency</th><th>Reminder</th><th>Status</th><th>Actions</th></tr></thead><tbody>{habits.map(h=><tr key={h._id}><td>{h.name}</td><td>{h.owner?.name||'—'}<br/><small>{h.owner?.email||''}</small></td><td>{h.category?.name||'—'}</td><td>{h.frequency}</td><td>{h.reminder||'—'}</td><td><span className={'status '+(h.active===false?'inactive':'')}>{h.active===false?'Inactive':'Active'}</span></td><td><div className="actions"><button className="btn btn-secondary" onClick={()=>startEdit(h)}>Edit</button><button className="btn btn-quiet" onClick={()=>setDel(h)}>Delete</button></div></td></tr>)}</tbody></table></div>
    {!habits.length&&<div className="empty">No habits found.</div>}
    <Modal open={!!del} title="Delete habit?" onClose={()=>setDel(null)} onConfirm={remove}>This permanently deletes “{del?.name}”.</Modal>
  </div>
}
