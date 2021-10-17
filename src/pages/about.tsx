import * as React from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"

import Copyright from "@components/Copyright"
export default function About() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          IOT Server v1
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Get
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom>
          Usage
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          {"/api/<scope_name_or_identifier>/[|config|records]"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {
            "<scope_name_or_identifier> is used to uniquely identify each of our projects. It can be a name or number. To avoid overlap, please announce in the group once you have decided on the same"
          }
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {
            "[|config|records] if specified it will fetch data for config or records, else it will get both the values"
          }
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {"Examples:"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {"/api/1          gets {config: {...}, records: [...]} for scope 1"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {"/api/1/config   gets {config: {...}} for scope 1"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {"/api/1/records  gets {records: [...]} for scope 1"}
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Post
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom>
          Usage
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          {"/api/<scope_name_or_identifier>/[reset|config|records]"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {
            "<scope_name_or_identifier> is used to uniquely identify each of our projects. It can be a name or number. To avoid overlap, please announce in the group once you have decided on the same"
          }
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {
            "[reset|config|records] specified action will be done using json data provided. 'reset' will erase record of specified scope. 'config' will create scope if not present and replace config with provided json. 'record' will create scope if not present and add json to the end of the records array along with server time as time field."
          }
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {"Examples:"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {"/api/1/reset    deletes scope 1"}
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {
            "/api/1/config   sets {config: {...}} for scope 1 using json provided"
          }
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {
            "/api/1/record   sets {records: [..., {data:<json_data>, time:<server_ts>}]} for scope 1"
          }
        </Typography>
      </Box>
      <Copyright />
    </Container>
  )
}
