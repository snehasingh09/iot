import consola from "consola"
import { useQuery } from "react-query"

const getData = async (scope: number | string) => {
  consola.debug("fetching mfList")
  return await fetch(`/api/store/${scope}`).then(async (response) => {
    if (response.status === 200) {
      return await response.json()
    }
  })
}

export default function useScope(scope: number | string, config: {}) {
  return useQuery(`Scope-${scope}`, () => getData(scope), config)
}
