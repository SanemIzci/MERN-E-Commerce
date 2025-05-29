import React from 'react';

function Input({ placeholder, type, value, name, id,onChange }) {
  return (
    <input
      className='w-full h-10 p-2 outline-none rounded-md my-2 border'
      placeholder={placeholder}
      value={value}
      name={name}
      id={id}
      type={type}
      onChange={onChange}
    />
  );
}

export default Input;


