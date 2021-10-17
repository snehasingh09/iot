import * as React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import consola from "consola"
import fetch from "isomorphic-unfetch"

import Copyright from "@components/Copyright"
import useBoolean from "@hooks/useBoolean"

export default function Index() {
  const { value: fetching, setValue: setFetching } = useBoolean(false)
  const [responseGet, setResponseGet] = React.useState<any | null | undefined>(
    {}
  )
  const [urlGet, setURLGet] = React.useState<string>("")
  const [urlPost, setURLPost] = React.useState<string>("")
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
  const handleGetClick = async () => {
    if (!fetching) {
      setFetching(true)
      consola.debug("GET Triggered")
      const data = await fetch(`api/store/${urlGet}`).then(
        async (response) => await response.json()
      )
      setResponseGet(data)
      setFetching(false)
    } else {
      consola.debug("fetch in progress")
    }
  }
  const handlePostClick = async () => {
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
      const data = await fetch(`api/store/${urlPost}`, requestOptions).then(
        async (response) => await response.json()
      )
      setResponsePost(data)
      setFetching(false)
    } else {
      consola.debug("fetch in progress")
    }
  }
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Test Page for API
        </Typography>
        <Stack
          direction="column"
          sx={{
            mx: 1,
            p: 2,
            border: "solid",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Get
          </Typography>
          <TextField
            label="Get URL"
            id="outlined-start-adornment"
            sx={{ m: 1, width: "100%" }}
            value={urlGet}
            onChange={(event) => setURLGet(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">/api/store/</InputAdornment>
              ),
            }}
          />
          <Typography variant="body1" component="h2" gutterBottom>
            Get Response
          </Typography>
          <Typography variant="body2" component="h3" gutterBottom>
            {`${JSON.stringify(responseGet)}`}
          </Typography>
          <Button onClick={() => handleGetClick()} disabled={fetching}>
            Get
          </Button>
        </Stack>
        <Stack
          direction="column"
          sx={{
            mx: 1,
            p: 2,
            border: "solid",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Post
          </Typography>
          <TextField
            label="Post URL"
            id="outlined-start-adornment"
            sx={{ mb: 1, width: "100%" }}
            value={urlPost}
            onChange={(event) => setURLPost(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">/api/store/</InputAdornment>
              ),
            }}
          />
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
            Data to be posted
          </Typography>
          <Typography variant="body2" component="h3" gutterBottom>
            {validJSON ? `${JSON.stringify(postData)}` : "JSON not valid"}
          </Typography>
          <Typography variant="body1" component="h2" gutterBottom>
            Post Response
          </Typography>
          <Typography variant="body2" component="h3" gutterBottom>
            {`${JSON.stringify(responsePost)}`}
          </Typography>
          <Button
            onClick={() => handlePostClick()}
            disabled={fetching || !validJSON}
          >
            Post
          </Button>
        </Stack>
      </Box>
      <Copyright />
    </Container>
  )
}
