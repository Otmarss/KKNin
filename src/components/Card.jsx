import React from 'react'

export default function Card({title, value, accent='blue'}){
  return (
    <div className={`stat-card accent-${accent}`}>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  )
}
