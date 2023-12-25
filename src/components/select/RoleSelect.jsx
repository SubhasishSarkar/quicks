import React from 'react'

const RoleSelect = ({...rest}) => {
  return (
    <select aria-label="Default select example" {...rest}>
    <option value="">Select One</option>
    <option value="SA">Super Admin</option>
    <option value="A">Admin</option>
</select>
  )
}

export default RoleSelect