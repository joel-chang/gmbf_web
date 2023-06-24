import * as React from 'react'
import { useState } from 'react'
import { ref, set } from 'firebase/database'

const OfferSaveForm = ({ auth, db, bfPercentage, imageId = 'NA' }) => {
  const [inputs, setInputs] = useState('')

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // alert(inputs)
    const userId = auth.currentUser?.uid
    const timeKey = new Date().getTime().toString()
    const record = ref(db, 'pub/users/' + userId + '/' + timeKey)
    set(record, {
      upper_bf: bfPercentage.upper,
      lower_bf: bfPercentage.lower,
      weight: inputs.weight,
      date: inputs.date,
      image_id: imageId,
    })
    console.log('pub/users/:\n')
  }

  return (
    <Dropdown
      trigger={<button>Save your progress!</button>}
      // menu={[<button onClick={upload_record}>Upload record.</button>]}
      menu={[
        <form onSubmit={handleSubmit}>
          <label>
            Enter date:
            <input
              type="date"
              name="date"
              value={inputs.date || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            Enter your weight:
            <input
              type="number"
              name="weight"
              value={inputs.weight || ''}
              onChange={handleChange}
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
                  console.log('menuItem.props')
                  console.log(menuItem.props)
                  menuItem.props.onSubmit()
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
