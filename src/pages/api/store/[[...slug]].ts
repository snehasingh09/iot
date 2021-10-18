import consola from "consola"
import { getUnixTime, fromUnixTime } from "date-fns"
import cache from "memory-cache"

const newEntry = () => {
  let map = new Map()
  map.set("config", {})
  map.set("records", [])
  return map
}

const createRecord = (record: any) => {
  return {
    data: record,
    time: getUnixTime(new Date()),
  }
}

const slugValidator = (slug: string[] | undefined, method: string) => {
  if (!slug || slug.length <= 2) {
    switch (method) {
      case "POST":
        return (
          slug &&
          slug.length === 2 &&
          ["config", "record", "reset"].includes(slug[1])
        )
      case "GET":
        return (
          !slug ||
          slug.length === 1 ||
          (slug.length === 2 && ["config", "records"].includes(slug[1]))
        )
    }
  }
  return false
}

export default async function handler(req: any, res: any) {
  const { slug } = req.query
  consola.debug("API", slug, req.method, req.body)
  if (!slugValidator(slug, req.method)) {
    res.status(400).json({
      status: "failed",
      message: "Operation failed slug test",
    })
    return
  }
  let storedData
  if (slug && slug.length) {
    storedData = cache.get(slug[0])
  }
  consola.debug("storedData", storedData)
  switch (req.method) {
    case "GET":
      if (!slug) {
        res.status(200).json({
          status: "success",
          data: {
            scopes: cache.keys(),
          },
        })
      } else if (!storedData) {
        res.status(400).json({
          status: "failed",
          message: `${slug[0]} doesn't have any data in cache`,
        })
      } else {
        consola.debug("GetSlug1", slug[1])
        if (slug.length === 1) {
          res.status(200).json({
            status: "success",
            data: {
              config: storedData.get("config"),
              records: storedData.get("records").map((e: any) => ({
                ...e,
                time: fromUnixTime(e.time).toISOString(),
              })),
            },
          })
        } else {
          switch (slug[1]) {
            case "config":
              res.status(200).json({
                status: "success",
                data: { config: storedData.get("config") },
              })
              break
            case "records":
              res.status(200).json({
                status: "success",
                data: { records: storedData.get("records") },
              })
              break
            default:
              res.status(405).end() //Method Not Allowed
              break
          }
        }
      }
      break
    case "POST":
      switch (slug[1]) {
        case "reset":
          if (storedData) {
            res.status(200).json({ status: cache.del(slug[0]) })
          } else {
            res.status(400).json({
              status: "failed",
              message: `${slug[0]} doesn't have any data in cache`,
            })
          }
          break
        case "config":
          if (!storedData) {
            storedData = newEntry()
            cache.put(slug[0], storedData)
          }
          storedData.set("config", req.body)
          res.status(200).json({ status: "success" })
          break
        case "record":
          if (!storedData) {
            storedData = newEntry()
            cache.put(slug[0], storedData)
          }
          storedData.set("records", [
            ...storedData.get("records"),
            createRecord(req.body),
          ])
          res.status(200).json({ status: "success" })
          break
        default:
          res.status(405).end() //Method Not Allowed
          break
      }
      break
    default:
      res.status(405).end() //Method Not Allowed
      break
  }
  // consola.debug("res", res)
}
