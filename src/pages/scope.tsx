import * as React from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Typography from "@mui/material/Typography"

import Copyright from "@components/Copyright"
import ValuedScope from "@components/ValuedScope"
import useScope from "@hooks/useScope"
export default function Scope() {
  const query = useScope("", {})
  const [scope, setScope] = React.useState<number | string>("")
  const handleChange = (event: any) => {
    setScope(event.target.value)
  }
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          IOT Server v1
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Select Scopes
        </Typography>
        {query.data?.data ? (
          <React.Fragment>
            {query.data.data.scopes.length ? (
              <React.Fragment>
                <Typography variant="h6" component="h3" gutterBottom>
                  Total Number: {query.data.data.scopes.length}
                </Typography>
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  error={!query.data.data.scopes.includes(scope)}
                >
                  <InputLabel id="demo-simple-select-error-label">
                    Scope
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-error-label"
                    id="demo-simple-select-error"
                    sx={{
                      width: "100%",
                    }}
                    value={scope}
                    label="Scope"
                    onChange={handleChange}
                    renderValue={(value) => `${value}`}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {query.data.data.scopes.map((e: any) => (
                      <MenuItem value={e} key={e}>
                        {e}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}
                  </Select>
                  {query.data.data.scopes.includes(scope) ? (
                    <FormHelperText>{scope} is selected</FormHelperText>
                  ) : (
                    <FormHelperText>Please pick a Scope</FormHelperText>
                  )}
                </FormControl>
              </React.Fragment>
            ) : (
              <Typography variant="h6" component="h3" gutterBottom>
                No Scopes Found!!!
              </Typography>
            )}
          </React.Fragment>
        ) : null}
        {scope !== "" ? <ValuedScope scope={scope} /> : null}
      </Box>
      <Copyright />
    </Container>
  )
}
