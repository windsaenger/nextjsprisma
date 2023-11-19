"use client"
import { getServerSideProps } from 'next/dist/build/templates/pages';
import React from 'react'
import { useFormStatus } from 'react-dom';

type Props = { type: "submit" | "reset" | "button", caption: string, classname: string };

const Button = ({type = "submit", caption = "submit", classname =""}: Props) => {
    const { pending, data, method, action } = useFormStatus();
    
  return (
    <button type={type} className={classname}>{pending ? `${caption}...` : caption}
    </button>
  )
  
}

export default Button