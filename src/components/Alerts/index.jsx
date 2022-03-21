import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'

function AlertDismissible() {
  const [show, setShow] = useState(true)

  if (show) {
    return (
      <Alert style={{ background: '#FFF', marginTop: '-10px' }} onClose={() => setShow(false)} dismissible>
        <Alert.Heading style={{ fontSize: '16px', fontWeight: 'bold' }}>Attention!</Alert.Heading>
        <p>We opened all of the Vaults! You can find your staked tokens and rewards in the Finished tab.</p>
      </Alert>
    )
  }
  return null
}

export default AlertDismissible
