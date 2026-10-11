import React,{useEffect,useState}from'react';
import{api}from'../services/api';
import{formatDate}from'../utils/transformers';
import{Modal,ErrorBox}from'../components/Layout';

const emptyForm={name:'',email:'',password:'',role:'user'};

export default function AdminUsers(){
  const[users,setUsers]=useState([]);
  const[form,setForm]=useState(emptyForm);
  const[editId,setEditId]=useState(null);
  const[del,setDel]=useState(null);
  const[error,setError]=useState('');
  const[message,setMessage]=useState('');

  const load=()=>api.users().then(setUsers).catch(e=>setError(e.message));
  useEffect(()=>{load()},[]);

  function change(e){setForm({...form,[e.target.name]:e.target.value})}

  function validate(){
    if(form.name.trim().length<2||form.name.trim().length>50)return'Name must be 2–50 characters.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))return'Enter a valid email address.';
    if(!editId&&form.password.length<6)return'Password must be at least 6 characters.';
    if(editId&&form.password&&form.password.length<6)return'New password must be at least 6 characters.';
    if(!['user','admin'].includes(form.role))return'Choose a valid role.';
    return'';
  }

  async function save(e){
    e.preventDefault();setError('');setMessage('');
    const problem=validate();if(problem)return setError(problem);
    try{
      if(editId){
        const payload={name:form.name.trim(),email:form.email.trim(),role:form.role};
        if(form.password)payload.password=form.password;
        await api.updateUser(editId,payload);
        setMessage('User updated successfully.');
      }else{
        await api.createUser({name:form.name.trim(),email:form.email.trim(),password:form.password,role:form.role});
        setMessage('User created successfully.');
      }
      cancelEdit();await load();
    }catch(e){setError(e.message)}
  }

  function startEdit(user){
    setEditId(user._id);setForm({name:user.name,email:user.email,password:'',role:user.role});
    setError('');setMessage('');window.scrollTo({top:0,behavior:'smooth'});
  }

  function cancelEdit(){setEditId(null);setForm(emptyForm)}

  async function remove(){
    try{await api.deleteUser(del._id);setDel(null);setMessage('User deleted successfully.');await load()}
    catch(e){setDel(null);setError(e.message)}
  }

  return <div className="container">
    <div className="page-intro"><span className="eyebrow">Administrator</span><h1 className="display">Manage users</h1><p>Add, edit roles and details, or remove user accounts.</p></div>

    <form className="form-stack surface" style={{padding:25,maxWidth:760,marginBottom:24}} onSubmit={save}>
      <h2 style={{marginTop:0}}>{editId?'Edit user':'Add user'}</h2>
      <div className="form-row">
        <label className="field"><span>Name</span><input name="name" value={form.name} onChange={change} required minLength="2" maxLength="50"/></label>
        <label className="field"><span>Email</span><input name="email" type="email" value={form.email} onChange={change} required maxLength="120"/></label>
      </div>
      <div className="form-row">
        <label className="field"><span>{editId?'New password (optional)':'Password'}</span><input name="password" type="password" value={form.password} onChange={change} required={!editId} minLength={editId?undefined:6} autoComplete="new-password"/></label>
        <label className="field"><span>Role</span><select name="role" value={form.role} onChange={change}><option value="user">User</option><option value="admin">Admin</option></select></label>
      </div>
      <ErrorBox error={error}/>
      {message&&<div className="notice">{message}</div>}
      <div className="actions"><button className="btn btn-primary">{editId?'Update user':'Add user'}</button>{editId&&<button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel edit</button>}</div>
    </form>

    <div className="table-wrap"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead><tbody>{users.map(user=><tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td><span className="status">{user.role}</span></td><td>{formatDate(user.createdAt)}</td><td><div className="actions"><button className="btn btn-secondary" onClick={()=>startEdit(user)}>Edit</button><button className="btn btn-quiet" onClick={()=>setDel(user)}>Delete</button></div></td></tr>)}</tbody></table></div>
    {!users.length&&<div className="empty">No users found.</div>}
    <Modal open={!!del} title="Delete user?" onClose={()=>setDel(null)} onConfirm={remove}>This permanently deletes {del?.email}.</Modal>
  </div>
}
