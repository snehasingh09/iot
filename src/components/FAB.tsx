import BarChartIcon from "@mui/icons-material/BarChart"
import InfoIcon from "@mui/icons-material/Info"
import MenuOpenIcon from "@mui/icons-material/MenuOpen"
import SettingsIcon from "@mui/icons-material/Settings"
import Link from "next/link"
import { Fab, Action } from "react-tiny-fab"

import "react-tiny-fab/dist/styles.css"

const FAB = () => {
  return (
    <Fab alwaysShowTitle={true} icon={<MenuOpenIcon />}>
      <Action text="About">
        <Link passHref href="/about">
          <InfoIcon />
        </Link>
      </Action>
      <Action text="Settings">
        <Link passHref href="/settings">
          <SettingsIcon />
        </Link>
      </Action>
      <Action text="Home">
        <Link passHref href="/">
          <BarChartIcon />
        </Link>
      </Action>
    </Fab>
  )
}
export default FAB
