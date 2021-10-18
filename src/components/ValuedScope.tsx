import * as React from "react"

import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import consola from "consola"
import { Bar } from "react-chartjs-2"

import PrettyPrintJSON from "@components/PrettyPrintJSON"
import useBoolean from "@hooks/useBoolean"
import useScope from "@hooks/useScope"

export default function ValuedScope(props: any) {
  const { scope } = props
  const query = useScope(scope, {})
  const [dataFields, setDataFields] = React.useState<string[]>([])
  const [selectedFieldX, setSelectedFieldX] = React.useState<string>("")
  const [chartData, setChartData] = React.useState<any | null>({})
  const { value: fetching, setValue: setFetching } = useBoolean(false)
  const [postData, setPostData] = React.useState<any>({})
  const { value: validJSON, setValue: setValidJSON } = useBoolean(true)
  const [responsePost, setResponsePost] = React.useState<
    any | null | undefined
  >({})
  const jsonParse = (s: string) => {
    try {
      let k = JSON.parse(s)
      setPostData(k)
      setValidJSON(true)
    } catch (e) {
      setValidJSON(false)
      setPostData({})
    }
  }
  const handlePostConfigClick = async () => {
    if (!fetching) {
      setFetching(true)
      consola.debug("POST Triggered")
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
      const data = await fetch(
        `api/store/${scope}/config`,
        requestOptions
      ).then(async (response) => await response.json())
      setResponsePost(data)
      setFetching(false)
    } else {
      consola.debug("fetch in progress")
    }
  }
  React.useEffect(() => {
    if (query.data) {
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
  }, [query, dataFields])
  const handleChange = (event: any) => {
    setSelectedFieldX(event.target.value)
  }
  React.useEffect(() => {
    if (dataFields.includes(selectedFieldX)) {
      let cData = {
        labels: query.data.data.records.map((e: any) => e.time),
        datasets: [
          {
            type: "line",
            label: selectedFieldX.toUpperCase(),
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            fill: false,
            data: query.data.data.records.map(
              (e: any) => e.data[selectedFieldX]
            ),
          },
        ],
      }
      setChartData(cData)
    }
  }, [selectedFieldX, dataFields, query])
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Detail for Scope: {scope}
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
                <Stack
                  direction="column"
                  sx={{
                    mx: 1,
                    p: 2,
                    border: "solid",
                  }}
                >
                  <PrettyPrintJSON ob={query.data.data.config} />
                  <TextField
                    id="outlined-multiline-flexible"
                    label="POST JSON"
                    multiline
                    minRows={4}
                    error={!validJSON}
                    onChange={(e) => {
                      consola.debug(e.target.value)
                      jsonParse(e.target.value)
                    }}
                  />
                  <Typography variant="body1" component="h2" gutterBottom>
                    Config to be posted
                  </Typography>
                  {!validJSON ? (
                    <Typography variant="body2" component="h3" gutterBottom>
                      {"JSON not valid"}
                    </Typography>
                  ) : (
                    <PrettyPrintJSON ob={postData} />
                  )}
                  <Accordion sx={{ my: 1 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="body1" component="h2" gutterBottom>
                        Post Response
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <PrettyPrintJSON ob={responsePost} />
                    </AccordionDetails>
                  </Accordion>
                  <Button
                    onClick={() => handlePostConfigClick()}
                    disabled={fetching || !validJSON}
                  >
                    UPDATE CONFIG
                  </Button>
                </Stack>
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
              sx={{ m: 1, width: "100%" }}
              error={!dataFields.includes(selectedFieldX)}
            >
              <InputLabel id="demo-simple-select-error-label">
                X-Axis
              </InputLabel>
              <Select
                labelId="demo-simple-select-error-label"
                id="demo-simple-select-error"
                sx={{
                  width: "100%",
                }}
                value={selectedFieldX}
                label="X-Axis"
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
              {dataFields.includes(selectedFieldX) ? (
                <FormHelperText>
                  {selectedFieldX} is selected for Y Axis
                </FormHelperText>
              ) : (
                <FormHelperText>Please pick a field for Y Axis</FormHelperText>
              )}
            </FormControl>
            {dataFields.includes(selectedFieldX) ? (
              <Bar data={chartData} />
            ) : null}
          </React.Fragment>
        ) : null}
      </Box>
    </Container>
  )
}
