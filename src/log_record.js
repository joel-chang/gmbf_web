import * as React from 'react'
import { ref, set } from 'firebase/database'
import { db } from './index.js'
import { auth } from '.'

const getAllRecords = () => {
  const userId = auth.currentUser?.uid
  const record = ref(db, 'pub/users/' + userId + '/')
  console.log(record)
}

const OfferSaveForm = ({
  auth,
  db,
  bfPercentage = '28',
  weight = '69',
  imageId = 'NA',
}) => {
  const upload_record = () => {
    const userId = auth.currentUser?.uid
    const timeKey = new Date().getTime().toString()
    const record = ref(db, 'pub/users/' + userId + '/' + timeKey)
    set(record, {
      bf_percentage: bfPercentage,
      weight: weight,
      image_id: imageId,
    })
    console.log('goung to get all records')
    getAllRecords()
  }

  return (
    <Dropdown
      trigger={<button>Save your progress!</button>}
      // menu={[<button onClick={upload_record}>Upload record.</button>]}
      menu={[
        <>
          <form>
            <label>
              Date:
              <input type="Date" name="date" />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <form>
            <label>
              Date:
              <input type="Date" name="date" />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </>,
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
