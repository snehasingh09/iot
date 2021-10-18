import * as React from "react"

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import cache from "memory-cache"
import Link from "next/link"

import Copyright from "@components/Copyright"
export default function About(props: any) {
  const { keys } = props
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          IOT Server v1
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Scopes Defined
        </Typography>
        <Typography variant="h6" component="h3" gutterBottom>
          Total Number: {keys.length}
        </Typography>
        {keys.length
          ? keys.map((e: any, i: number) => (
              <Link passHref href={`/scope/${e}`} key={i}>
                <Typography variant="body1" component="p" gutterBottom>
                  {e}
                </Typography>
              </Link>
            ))
          : null}
      </Box>
      <Copyright />
    </Container>
  )
}

export function getServerSideProps() {
  return {
    props: {
      keys: cache.keys(),
    },
  }
}
