export const Select = ({children, onSelcted, selectedVal, label, subLabel}) => {

  const handleChange = (e) => {
    onSelcted(e.target.value);
  }

  return (<label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text">{label}</span>
    <span className="label-text-alt font-bold">{subLabel}</span>
  </div>
  <select onChange={e => handleChange(e)} value={selectedVal} className="select select-bordered">
    {children}
  </select>
</label>)
}