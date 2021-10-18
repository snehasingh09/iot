import * as React from "react"

import Box from "@mui/material/Box"

const PrettyPrintJSON = (props: any) => {
  const { ob } = props
  return (
    <Box>
      <pre>{JSON.stringify(ob, null, 2)}</pre>
    </Box>
  )
}

export default PrettyPrintJSON
