import * as React from "react"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { Bar } from "react-chartjs-2"

import Copyright from "@components/Copyright"
import PrettyPrintJSON from "@components/PrettyPrintJSON"
import useScope from "@hooks/useScope"

export default function About() {
  const router = useRouter()
  const scope = router.asPath.split("/").slice(-1)[0]
  const query = useScope(scope, {})
  const [dataFields, setDataFields] = React.useState<string[]>([])
  const [selectedField, setSelectedField] = React.useState<string>("")
  const [chartData, setChartData] = React.useState<any | null>({})
  React.useEffect(() => {
    if (!query.data) {
      router.push("/scope")
    } else {
      let fields = [...dataFields]
      let touched = false
      for (const record of query.data.data.records) {
        for (const field in record.data) {
          if (!fields.some((e) => e === field)) {
            fields = [...fields, field]
            touched = true
          }
        }
        if (touched) {
          setDataFields(fields)
        }
      }
    }
  }, [query, dataFields, router])
  const handleChange = (event: any) => {
    setSelectedField(event.target.value)
  }
  React.useEffect(() => {
    if (dataFields.includes(selectedField)) {
      let cData = {
        labels: query.data.data.records.map((e: any) => e.time),
        datasets: [
          {
            type: "line",
            label: selectedField.toUpperCase(),
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            fill: false,
            data: query.data.data.records.map(
              (e: any) => e.data[selectedField]
            ),
          },
        ],
      }
      setChartData(cData)
    }
  }, [selectedField, dataFields, query])
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          IOT Server v1
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Scope {scope}
        </Typography>
        {query.data ? (
          <React.Fragment>
            <Accordion sx={{ my: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  Config
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PrettyPrintJSON ob={query.data.data.config} />
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ my: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  Records
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <PrettyPrintJSON ob={query.data.data.records} />
              </AccordionDetails>
            </Accordion>
            <Typography variant="h6" component="h3" gutterBottom>
              Fields
            </Typography>
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              error={!dataFields.includes(selectedField)}
            >
              <InputLabel id="demo-simple-select-error-label">
                Fields
              </InputLabel>
              <Select
                labelId="demo-simple-select-error-label"
                id="demo-simple-select-error"
                sx={{
                  width: "100%",
                }}
                value={selectedField}
                label="Fields"
                onChange={handleChange}
                renderValue={(value) => `${value}`}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {dataFields.map((e) => (
                  <MenuItem value={e} key={e}>
                    {e}
                  </MenuItem>
                ))}
                {/* <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}
              </Select>
              {dataFields.includes(selectedField) ? (
                <FormHelperText>
                  {selectedField} is selected for Y Axis
                </FormHelperText>
              ) : (
                <FormHelperText>Please pick a field for Y Axis</FormHelperText>
              )}
            </FormControl>
            {dataFields.includes(selectedField) ? (
              <Bar data={chartData} />
            ) : null}
          </React.Fragment>
        ) : null}
        {/* <Typography variant="body1" component="p" gutterBottom>
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
        </Typography> */}
      </Box>
      <Copyright />
    </Container>
  )
}
