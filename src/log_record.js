import * as React from 'react'
import { useState } from 'react'
import { ref, set } from 'firebase/database'
import { db } from './index.js'
import { auth } from '.'

const getAllRecords = () => {
  const userId = auth.currentUser?.uid
  const record = ref(db, 'pub/users/' + userId + '/')
  console.log(record)
}

const OfferSaveForm = ({ auth, db, bfPercentage, weight, imageId = 'NA' }) => {
  const [name, setName] = useState('')

  const upload_record = (event) => {
    event.preventDefault()
    console.log('date')
    console.log(name)
    const userId = auth.currentUser?.uid
    const timeKey = new Date().getTime().toString()
    const record = ref(db, 'pub/users/' + userId + '/' + timeKey)
    set(record, {
      bf_percentage: bfPercentage,
      weight: weight,
      image_id: imageId,
    })
    console.log('going to get all records')
    console.log(ref(db, 'pub/users/' + userId + '/'))
  }

  return (
    <Dropdown
      trigger={<button>Save your progress!</button>}
      // menu={[<button onClick={upload_record}>Upload record.</button>]}
      menu={[
        <form onSubmit={upload_record}>
          <label>
            Date:
            <input
              type="Date"
              name="date"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Weight
            <input
              type="text"
              name="weight"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>,
      ]}
    />
  )
}

const Dropdown = ({ trigger, menu }) => {
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <div className="dropdown">
      {React.cloneElement(trigger, {
        onClick: handleOpen,
      })}
      {open ? (
        <ul className="menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
              {React.cloneElement(menuItem, {
                onClick: () => {
                  menuItem.props.onClick()
                  setOpen(false)
                },
              })}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default OfferSaveForm
